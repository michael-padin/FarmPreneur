"use client"

import { Lightbox } from "@/components/fp/fp-light-box"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"
import { useState } from "react"

interface VerificationDocumentCellProps {
	image: string
}

export const VerificationDocumentCell = ({
	image
}: VerificationDocumentCellProps) => {
	const [lightboxOpen, setLightboxOpen] = useState(false)
	return (
		<div className="flex w-full justify-center space-x-2">
			<AspectRatio
				onClick={() => setLightboxOpen(true)}
				ratio={1.585 / 1}
				className="relative"
			>
				<Image
					src={image}
					alt={"Farmer Verification Document"}
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
