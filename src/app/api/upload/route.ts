import { s3Client } from "@/lib/s3-client"
import { PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
	try {
		const { filename, contentType, path } = await request.json()

		if (!filename || !contentType) {
			return NextResponse.json(
				{ error: "Filename and content type are required" },
				{ status: 400 }
			)
		}

		const allowedTypes = ["image/jpeg", "image/png", "application/pdf"]
		if (!allowedTypes.includes(contentType)) {
			return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
		}

		const key = `${path}/${crypto.randomUUID()}-${filename}`

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
