import { Lightbox } from "@/components/fg/fp-light-box"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Image as PrismaImage } from "@prisma/client"
import Image from "next/image"
import { useState } from "react"

interface CategoryImageCellProps {
	image: PrismaImage
}
export function CategoryImageCell({ image }: CategoryImageCellProps) {
	const [lightboxOpen, setLightboxOpen] = useState(false)
	return (
		<div className="flex w-full justify-center space-x-2">
			<AspectRatio
				onClick={() => setLightboxOpen(true)}
				ratio={1.585 / 1}
				className="relative overflow-hidden rounded-lg"
			>
				<Image
					src={image.url}
					alt={image.filename}
					className="object-cover"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					fill
				/>
			</AspectRatio>
			{lightboxOpen && image && (
				<Lightbox
					images={Array.isArray(image) ? image : [image]}
					currentIndex={0}
					onClose={() => setLightboxOpen(false)}
				/>
			)}
		</div>
	)
}
