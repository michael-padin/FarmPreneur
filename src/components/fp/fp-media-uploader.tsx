"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MediaFile } from "@/types/media"
import { FileIcon, Plus, X } from "lucide-react"
import Image from "next/image"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"

export interface FPMediaUploaderProps {
	initialMedia: MediaFile[] | MediaFile | null
	onChange?: (media: MediaFile[] | MediaFile | null) => void
	maxFiles?: number
	accept?: Record<string, string[]>
	maxSize?: number
	className?: string
	dropzoneText?: string
	mediaClassName?: string
	mediaItemClassName?: string
	singleImage?: boolean
	imageClassName?: string
}

export function FPMediaUploader({
	initialMedia = [],
	onChange,
	maxFiles = Infinity,
	accept = {
		"image/*": [],
		"video/*": []
	},
	maxSize = 10 * 1024 * 1024, // 10MB
	className = "",
	imageClassName = "",
	dropzoneText = "Add Media",
	mediaClassName = "w-24 h-24 object-cover rounded-lg",
	singleImage = false
}: FPMediaUploaderProps) {
	// Normalize initialMedia to always be an array
	const normalizedMedia = Array.isArray(initialMedia)
		? initialMedia
		: initialMedia
			? [initialMedia]
			: []

	const [media, setMedia] = useState<MediaFile[]>(normalizedMedia)
	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const newMedia = acceptedFiles.map((file) => ({
				id: `new-${Math.random().toString(36).substring(7)}-${file.name}`,
				file,
				url: URL.createObjectURL(file),
				type: file.type.startsWith("image/")
					? "image"
					: ("video" as MediaFile["type"])
			}))

			if (singleImage) {
				onChange?.(newMedia[0])
				setMedia([newMedia[0]])
			} else {
				setMedia([...media, ...newMedia].slice(0, maxFiles))
				onChange?.([...media, ...newMedia].slice(0, maxFiles))
			}
		},
		[media, maxFiles, onChange, singleImage]
	)

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept,
		maxSize,
		multiple: singleImage ? false : maxFiles > 1,
		maxFiles: singleImage ? 1 : maxFiles - media.length
	})

	const removeMedia = (id: string) => {
		if (singleImage) {
			onChange?.(null)
			setMedia([])
			return
		}
		onChange?.(media.filter((item) => item.id !== id))
		setMedia(media.filter((item) => item.id !== id))
	}

	const renderMediaItem = (item: MediaFile) => (
		<div
			key={item.id}
			className={cn("relative rounded-lg border", mediaClassName)}
		>
			{item.type === "image" ? (
				<Image
					src={item.url || "/placeholder.svg"}
					alt="Uploaded image"
					fill
					priority
					className={cn(
						"h-full w-full rounded-lg object-cover",
						imageClassName
					)}
				/>
			) : (
				<div
					className={`flex items-center justify-center bg-muted ${mediaClassName}`}
				>
					<FileIcon className="h-8 w-8 bg-muted-foreground" />
				</div>
			)}
			<Button
				variant="destructive"
				type="button"
				size="icon"
				className="absolute right-0 top-0 h-5 w-5 rounded-full lg:hidden lg:group-hover:flex"
				onClick={() => removeMedia(item.id)}
			>
				<X className="!h-4 !w-4" />
			</Button>
		</div>
	)

	const renderDropZone = () => (
		<div
			{...getRootProps()}
			className={`flex cursor-pointer items-center justify-center border border-dashed ${mediaClassName} ${
				isDragActive
					? "border border-dashed border-primary bg-green-50 text-primary"
					: "text-muted-foreground"
			}`}
		>
			<input {...getInputProps()} />
			<Plus className="h-8 w-8" />
			<span className="sr-only">{dropzoneText}</span>
		</div>
	)

	return (
		<div className={`flex gap-2 ${className} flex-wrap`}>
			{singleImage ? (
				media.length > 0 ? (
					renderMediaItem(media[0])
				) : (
					renderDropZone()
				)
			) : (
				<>
					{media.map(renderMediaItem)}
					{media.length < maxFiles && renderDropZone()}
				</>
			)}
		</div>
	)
}
