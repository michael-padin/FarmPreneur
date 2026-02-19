import { auth } from "@/auth"
import { s3Client } from "@/lib/s3-client"
import { PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { NextResponse } from "next/server"

const FILE_PATH_REGEX = /^[a-z0-9][a-z0-9-]{1,62}$/i
const ALLOWED_CONTENT_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"application/pdf"
]

const sanitizeFilename = (filename: string) =>
	filename
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9._-]/g, "-")
		.replace(/-+/g, "-")
		.replace(/^[-_.]+/, "")
		.slice(0, 128)

const requireAuth = async () => {
	const session = await auth()
	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
	}

	return null
}

export async function POST(request: Request) {
	try {
		const unauthorized = await requireAuth()
		if (unauthorized) return unauthorized

		const { filename, contentType, path } = await request.json()

		if (!filename || !contentType || !path) {
			return NextResponse.json(
				{ error: "Filename, content type, and path are required" },
				{ status: 400 }
			)
		}

		if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
			return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
		}

		const normalizedPath = String(path).trim().toLowerCase()
		const normalizedFilename = sanitizeFilename(String(filename))

		if (!FILE_PATH_REGEX.test(normalizedPath)) {
			return NextResponse.json(
				{ error: "Invalid upload path" },
				{ status: 400 }
			)
		}

		if (!normalizedFilename) {
			return NextResponse.json({ error: "Invalid file name" }, { status: 400 })
		}

		const key = `${normalizedPath}/${crypto.randomUUID()}-${normalizedFilename}`

		const command = new PutObjectCommand({
			Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
			Key: key,
			ContentType: contentType
		})

		const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
		return NextResponse.json({ signedUrl, key })
	} catch (error) {
		console.error("Error generating signed URL:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}

export async function GET() {
	try {
		const unauthorized = await requireAuth()
		if (unauthorized) return unauthorized

		const command = new ListObjectsV2Command({
			Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
			Prefix: "uploads/"
		})

		const response = await s3Client.send(command)
		const files =
			response.Contents?.map((file) => ({
				name: file.Key?.split("/").pop(),
				size: file.Size,
				lastModified: file.LastModified
			})) || []

		return Response.json({ files })
	} catch (error) {
		console.error("Error listing files:", error)
		return Response.json({ error: "Internal server error" }, { status: 500 })
	}
}
