import { s3Client } from "@/lib/s3-client"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"

export async function DELETE(request: Request) {
	try {
		const { url } = await request.json()

		if (!url) {
			return NextResponse.json(
				{ error: "File URL is required" },
				{ status: 400 }
			)
		}

		// Create a new URL object
		const parsedUrl = new URL(url)

		// Extract the pathname and decode it
		const key = decodeURIComponent(parsedUrl.pathname.slice(1)) // Removes the leading slash

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
