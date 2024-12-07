"use client"

import Image from "next/image"
import { useState } from "react"
import { GridTileImage } from "./grid-tile-image"

export function Gallery({
	images
}: {
	images: { src: string; altText: string }[]
}) {
	const [imageIndex, setImageIndex] = useState(0)
	const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0
	const previousImageIndex =
		imageIndex === 0 ? images.length - 1 : imageIndex - 1

	return (
		<div>
			<div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
				{images[imageIndex] && (
					<Image
						className="h-full w-full object-cover"
						fill
						sizes="(min-width: 1024px) 66vw, 100vw"
						alt={images[imageIndex]?.altText as string}
						src={images[imageIndex]?.src as string}
						priority={true}
					/>
				)}
			</div>

			{images.length > 1 ? (
				<ul className="flex flex-wrap items-center gap-2 px-3 pt-3 lg:mb-0">
					{images.map((image, index) => {
						const isActive = index === imageIndex

						return (
							<li key={image.src} className="h-14 w-14">
								<button
									onClick={() => setImageIndex(index)}
									aria-label="Select product image"
									className="h-full w-full"
								>
									<GridTileImage
										alt={image.altText}
										src={image.src}
										width={80}
										height={80}
										active={isActive}
									/>
								</button>
							</li>
						)
					})}
				</ul>
			) : null}
		</div>
	)
}
