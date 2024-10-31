"use client"

import * as React from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Trash, Info } from "lucide-react"
import { DialogTitle } from "@radix-ui/react-dialog"

interface LightboxProps {
	images: { url: string; filename: string; size: number }[]
	currentIndex: number
	onClose?: () => void
	onDelete?: (index: number) => void
	onPrevious?: () => void
	onNext?: () => void
}

export function Lightbox({
	images,
	currentIndex,
	onClose,
	onDelete,
	onPrevious,
	onNext
}: LightboxProps) {
	const currentImage = images[currentIndex]
	const [showInfo, setShowInfo] = React.useState(false)

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogHeader>
				<DialogTitle></DialogTitle>
			</DialogHeader>
			<DialogContent className="h-full max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg p-0">
				<div className="relative flex h-full w-full items-center justify-center">
					<Image
						src={currentImage.url}
						alt={currentImage.filename}
						layout="fill"
						objectFit="contain"
					/>
					<div className="absolute right-4 top-4 flex space-x-2">
						<Button
							variant="outline"
							size="icon"
							onClick={() => setShowInfo(!showInfo)}
						>
							<Info className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							onClick={() => onDelete?.(currentIndex)}
						>
							<Trash className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							onClick={onClose}
							className="z-10"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
					{showInfo && (
						<div className="absolute bottom-4 left-4 right-4 rounded-md bg-background/80 p-2">
							<p className="text-sm font-medium">{currentImage.filename}</p>
							<p className="text-xs text-muted-foreground">
								{(currentImage.size / 1024 / 1024).toFixed(2)} MB
							</p>
						</div>
					)}
					{currentIndex > 0 && (
						<Button
							variant="outline"
							size="icon"
							className="absolute left-4 top-1/2 -translate-y-1/2 transform"
							onClick={onPrevious}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
					)}
					{currentIndex < images.length - 1 && (
						<Button
							variant="outline"
							size="icon"
							className="absolute right-4 top-1/2 -translate-y-1/2 transform"
							onClick={onNext}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}
