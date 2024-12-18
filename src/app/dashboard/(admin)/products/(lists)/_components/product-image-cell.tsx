import { Lightbox } from "@/components/fp/fp-light-box"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"
import { useState } from "react"

interface ProductImageCellProps {
	images: string[]
	altText: string
}
export function ProductImageCell({ images, altText }: ProductImageCellProps) {
	const [lightboxOpen, setLightboxOpen] = useState(false)
	return (
		<div className="flex w-full justify-center space-x-2">
			<AspectRatio
				onClick={() => setLightboxOpen(true)}
				ratio={1.585 / 1}
				className="relative overflow-hidden rounded-lg"
			>
				<Image
					src={images[0] || "/placeholder.svg"}
					alt={altText || "Product image"}
					className="object-cover"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					fill
				/>
			</AspectRatio>
			{lightboxOpen && images.length > 0 && (
				<Lightbox
					images={Array.isArray(images) ? images : [images]}
					currentIndex={0}
					onClose={() => setLightboxOpen(false)}
				/>
			)}
		</div>
	)
}
