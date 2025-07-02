"use client"

import { Package } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { GridTileImage } from "./grid-tile-image"

export function Gallery({
	images,
	title
}: {
	images: string[]
	title: string
}) {
	const [imageIndex, setImageIndex] = useState(0)

	// Handle empty images array
	if (!images || images.length === 0) {
		return (
			<div className="flex h-full w-full flex-col">
				<div className="relative aspect-square w-full overflow-hidden bg-gray-50 dark:bg-gray-900/20">
					<div className="flex h-full w-full items-center justify-center">
						<Package className="h-20 w-20 text-gray-400 opacity-20" />
					</div>
				</div>
			</div>
		)
	}

	return (
		<div>
			<div className="relative aspect-square max-h-[550px] w-full overflow-hidden">
				<Image
					className="h-auto w-auto object-cover"
					fill
					sizes="(min-width: 1024px) 66vw, 100vw"
					alt={`${title} ${imageIndex + 1}`}
					src={images[imageIndex]}
					priority
				/>
			</div>

			{images.length > 1 ? (
				<ul className="flex flex-wrap items-center gap-2 p-3 lg:mb-0">
					{images.map((image, index) => {
						const isActive = index === imageIndex

						return (
							<li key={image} className="h-14 w-14">
								<button
									onClick={() => setImageIndex(index)}
									aria-label="Select product image"
									className="h-auto w-auto"
								>
									<GridTileImage
										alt={`${title} ${index + 1} navigator`}
										src={image}
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
