"use client"

import Image from "next/image"
import { useState } from "react"

interface FPDynamicImageProps {
	src: string
	alt: string
}

export default function FPDynamicImage({ src, alt }: FPDynamicImageProps) {
	const [isPortrait, setIsPortrait] = useState(false)
	const fixedWidth = 300 // Fixed width in pixels
	const landscapeHeight = Math.round(fixedWidth * (9 / 16)) // 16:9 aspect ratio
	const portraitHeight = Math.round(fixedWidth * (4 / 3)) // 4:3 aspect ratio for portraits
	return (
		<div
			className="relative w-full"
			style={{
				height: isPortrait ? `${portraitHeight}px` : `${landscapeHeight}px`
			}}
		>
			<Image
				src={src}
				alt={alt}
				fill
				sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				className="w-full rounded-lg object-cover"
				onLoadingComplete={({ naturalWidth, naturalHeight }) => {
					setIsPortrait(naturalHeight > naturalWidth)
				}}
			/>
		</div>
	)
}
