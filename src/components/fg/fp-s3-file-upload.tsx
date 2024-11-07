"use client"

import React, { useCallback, useState } from "react"
import { Accept, useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Trash, UploadCloud } from "lucide-react"
import { getErrorMessage } from "@/lib/handle-error"
import { Toaster } from "../ui/toaster"
import { Lightbox } from "./fp-light-box"
import Image from "next/image"
import { Input } from "../ui/input"
import { AnimatePresence, motion } from "framer-motion"
import { toast } from "sonner"

interface FileInfo {
	url: string
	filename: string
	size: number
	mimeType: string
}

export const MAX_FILE_SIZE = 5000000 // 5 MB
export const ACCEPTED_IMAGE_TYPES: Accept = {
	"image/*": [".png", ".jpg", ".jpeg"]
}
export const MAX_FILES = 5

interface FlexibleFileUploadProps {
	value: FileInfo | FileInfo[] | null
	onChange?: (value: FileInfo | FileInfo[] | null) => void
	accept?: Accept
	multiple?: boolean
	maxFiles?: number
	maxSize?: number
	path: string
}

export function FileUpload({
	value,
	onChange,
	accept,
	multiple = false,
	maxFiles = 1,
	maxSize,
	path
}: FlexibleFileUploadProps) {
	const [isUploading, setIsUploading] = useState(false)
	const [uploadProgress, setUploadProgress] = useState(0)
	const [lightboxOpen, setLightboxOpen] = useState(false)
	const [currentImageIndex, setCurrentImageIndex] = useState(0)

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			setIsUploading(true)
			setUploadProgress(0)

			const uploadedFiles: FileInfo[] = []

			try {
				for (let i = 0; i < acceptedFiles.length; i++) {
					const file = acceptedFiles[i]
					const fileData = await uploadFile(file, (progress) => {
						setUploadProgress(() => {
							const newProgress =
								(i / acceptedFiles.length) * 100 +
								progress / acceptedFiles.length
							return Math.min(newProgress, 100)
						})
					})
					if (fileData) {
						uploadedFiles.push(fileData)
					}
				}

				onChange?.(multiple ? uploadedFiles : uploadedFiles[0] || null)
				toast.success("Upload successful", {
					description: `${uploadedFiles.length} file(s) uploaded successfully.`
				})
			} catch (error) {
				getErrorMessage(error)
			} finally {
				setIsUploading(false)
			}
		},
		[multiple, onChange]
	)

	const uploadFile = async (
		file: File,
		onProgress: (progress: number) => void
	): Promise<FileInfo | null> => {
		try {
			const response = await fetch("/api/upload", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					filename: file.name,
					contentType: file.type,
					path: path
				})
			})

			if (!response.ok) throw new Error("Failed to get pre-signed URL")

			const { signedUrl, key } = await response.json()

			const xhr = new XMLHttpRequest()
			xhr.open("PUT", signedUrl, true)
			xhr.setRequestHeader("Content-Type", file.type)

			xhr.upload.onprogress = (event) => {
				if (event.lengthComputable) {
					const percentComplete = (event.loaded / event.total) * 100
					onProgress(percentComplete)
				}
			}

			await new Promise((resolve, reject) => {
				xhr.onload = () => {
					if (xhr.status === 200) {
						resolve(null)
					} else {
						reject(new Error("Failed to upload file to R2"))
					}
				}
				xhr.onerror = () => reject(new Error("Network error during upload"))
				xhr.send(file)
			})

			const fileUrl = `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_DOMAIN}/${encodeURIComponent(key)}`

			return {
				url: fileUrl,
				filename: file.name,
				size: file.size,
				mimeType: file.type
			}
		} catch (error) {
			console.error(`Error uploading file ${file.name}:`, error)
			throw error
		}
	}

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: accept ? { accept: [] } : ACCEPTED_IMAGE_TYPES,
		multiple,
		maxFiles: maxFiles || MAX_FILES,
		maxSize: maxSize || MAX_FILE_SIZE
	})

	const removeFile = useCallback(
		async (fileToRemove: FileInfo) => {
			try {
				const response = await fetch("/api/delete-file", {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ url: fileToRemove.url })
				})

				if (!response.ok) {
					throw new Error("Failed to delete file")
				}

				if (multiple) {
					onChange?.(
						(value as FileInfo[]).filter(
							(file) => file.url !== fileToRemove.url
						)
					)
				} else {
					onChange?.(null)
				}

				toast.success("File removed", {
					description: "File has been removed successfully.",
					closeButton: true
				})
			} catch (error) {
				getErrorMessage(error)
			}
		},
		[multiple, onChange, value, toast]
	)

	const openLightbox = (index: number) => {
		setCurrentImageIndex(index)
		setLightboxOpen(true)
	}

	const closeLightbox = () => {
		setLightboxOpen(false)
	}

	const nextImage = () => {
		setCurrentImageIndex((prevIndex) =>
			prevIndex < (value as FileInfo[]).length - 1 ? prevIndex + 1 : prevIndex
		)
	}

	const previousImage = () => {
		setCurrentImageIndex((prevIndex) =>
			prevIndex > 0 ? prevIndex - 1 : prevIndex
		)
	}

	return (
		<>
			<Toaster />
			<div className="space-y-4">
				<div
					{...getRootProps()}
					className={`group cursor-pointer rounded-lg border-2 border-dashed p-4 text-center ${
						isDragActive
							? "border-primary text-primary"
							: "border-input text-muted-foreground"
					}`}
				>
					<Input {...getInputProps()} />
					<UploadCloud className="mx-auto h-10 w-10" />
					<p className="mt-2 text-sm">
						{isUploading
							? "Uploading..."
							: `Drag & drop ${multiple ? "files" : "a file"} here, or click to select ${
									multiple ? "files" : "a file"
								}`}
					</p>
				</div>

				<AnimatePresence>
					{isUploading && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "8px" }}
							exit={{ opacity: 0, height: 0 }}
							style={{
								width: "100%",
								background: "#e2e8f0",
								borderRadius: "9999px",
								overflow: "hidden",
								position: "relative"
							}}
						>
							<motion.div
								initial={{ width: "0%" }}
								animate={{ width: `${uploadProgress}%` }}
								style={{
									height: "100%",
									background: "hsl(var(--primary))",
									position: "absolute",
									left: 0,
									top: 0
								}}
								transition={{ duration: 0.5, ease: "easeInOut" }}
							/>
							<motion.div
								animate={{
									x: ["0%", "100%"]
								}}
								transition={{
									duration: 1,
									ease: "linear",
									repeat: Infinity
								}}
								style={{
									width: "100%",
									height: "100%",
									background:
										"linear-gradient(to right, transparent, rgba(255, 255, 255, 0.5), transparent)",
									position: "absolute",
									left: 0,
									top: 0
								}}
							/>
						</motion.div>
					)}
				</AnimatePresence>
				{value && (
					<div className="space-y-2">
						{multiple ? (
							<div className="grid grid-cols-2 gap-2">
								{(value as FileInfo[]).map((file, index) =>
									file.url ? (
										<FileItem
											key={file.url}
											file={file}
											onRemove={removeFile}
											onClick={() => openLightbox(index)}
										/>
									) : null
								)}
							</div>
						) : (value as FileInfo).url ? (
							<FileItem
								file={value as FileInfo}
								onRemove={removeFile}
								onClick={() => openLightbox(0)}
							/>
						) : null}
					</div>
				)}
			</div>
			{lightboxOpen && value && (
				<Lightbox
					images={Array.isArray(value) ? value : [value]}
					currentIndex={currentImageIndex}
					onClose={closeLightbox}
					onDelete={(index) => {
						removeFile(Array.isArray(value) ? value[index] : value)
						closeLightbox()
					}}
					onPrevious={previousImage}
					onNext={nextImage}
				/>
			)}
		</>
	)
}

interface FileItemProps {
	file: FileInfo
	onRemove: (file: FileInfo) => void
	onClick: () => void
}

function FileItem({ file, onRemove, onClick }: FileItemProps) {
	const isImage = file.mimeType?.startsWith("image/")

	return (
		<div className="group relative aspect-square h-28 cursor-pointer overflow-hidden rounded-lg border bg-background">
			<div
				className="relative aspect-square w-full"
				onClick={() => isImage && onClick()}
			>
				{isImage && (
					<Image
						src={file.url}
						alt={file.filename}
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						className="object-cover"
					/>
				)}
			</div>
			<Button
				variant="destructive"
				size="icon"
				type="button"
				className="absolute right-2 top-2 z-10 opacity-100 transition-opacity group-hover:opacity-100 lg:opacity-0"
				onClick={() => onRemove(file)}
			>
				<Trash className="h-4 w-4" />
			</Button>
		</div>
	)
}
