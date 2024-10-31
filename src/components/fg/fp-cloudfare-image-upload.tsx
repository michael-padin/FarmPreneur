"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface CloudflareImageUploadProps {
	onChange?: (urls: string[]) => void
	value: string[]
	multiple?: boolean
	maxFiles?: number
}

export function CloudflareImageUpload({
	onChange,
	value,
	multiple = true,
	maxFiles = 5
}: CloudflareImageUploadProps) {
	const [uploading, setUploading] = useState(false)

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			setUploading(true)
			const uploadPromises = acceptedFiles.map(async (file) => {
				const formData = new FormData()
				formData.append("file", file)

				try {
					const response = await fetch("/api/upload", {
						// You'll need to create this API route
						method: "POST",
						body: formData
					})

					if (!response.ok) {
						throw new Error("Upload failed")
					}

					const data = await response.json()
					return data.url
				} catch (error) {
					console.error("Upload error:", error)
					return null
				}
			})

			const urls = (await Promise.all(uploadPromises)).filter(
				Boolean
			) as string[]
			onChange?.([...value, ...urls].slice(0, maxFiles))
			setUploading(false)
		},
		[onChange, value, maxFiles]
	)

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/*": [".png", ".jpg", ".jpeg", ".gif"]
		},
		multiple,
		maxFiles: maxFiles - value.length
	})

	const removeImage = (index: number) => {
		const newValue = [...value]
		newValue.splice(index, 1)
		onChange?.(newValue)
	}

	return (
		<div>
			<div
				{...getRootProps()}
				className={`cursor-pointer rounded-md border-2 border-dashed p-4 text-center ${
					isDragActive ? "border-primary" : "border-gray-300"
				}`}
			>
				<Input {...getInputProps()} />
				{isDragActive ? (
					<p>Drop the files here ...</p>
				) : (
					<p>
						Drag &apos;n&apos; drop some files here, or click to select files
					</p>
				)}
			</div>
			{uploading && <p className="mt-2">Uploading...</p>}
			<div className="mt-4 grid grid-cols-2 gap-4">
				{value.map((url, index) => (
					<div key={url} className="relative">
						<img
							src={url}
							alt={`Uploaded ${index + 1}`}
							className="h-auto w-full rounded-md"
						/>
						<Button
							variant="destructive"
							size="icon"
							className="absolute right-2 top-2"
							onClick={() => removeImage(index)}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				))}
			</div>
		</div>
	)
}
