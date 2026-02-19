import { auth } from "@/auth"
import { s3Client } from "@/lib/s3-client"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"

const STORAGE_KEY_REGEX = /^[a-z0-9][a-z0-9/_\-.]{1,255}$/i

const requireAuth = async () => {
	const session = await auth()
	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
	}

	return null
}

export async function DELETE(request: Request) {
	try {
		const unauthorized = await requireAuth()
		if (unauthorized) return unauthorized

		const { url } = await request.json()

		if (!url) {
			return NextResponse.json(
				{ error: "File URL is required" },
				{ status: 400 }
			)
		}

		// Create a new URL object
		const parsedUrl = new URL(url)
		const publicDomain = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_DOMAIN

		if (publicDomain) {
			const publicOrigin = new URL(publicDomain).origin
			if (parsedUrl.origin !== publicOrigin) {
				return NextResponse.json(
					{ error: "File URL is not from the configured storage domain" },
					{ status: 400 }
				)
			}
		}

		// Extract the pathname and decode it
		const key = decodeURIComponent(parsedUrl.pathname.slice(1)) // Removes the leading slash

		if (
			!STORAGE_KEY_REGEX.test(key) ||
			key.includes("..") ||
			!key.includes("/")
		) {
			return NextResponse.json({ error: "Invalid file key" }, { status: 400 })
		}

		const command = new DeleteObjectCommand({
			Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
			Key: key
		})

		await s3Client.send(command)

		return NextResponse.json({ message: "File deleted successfully" })
	} catch (error) {
		console.error("Error deleting file:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}
