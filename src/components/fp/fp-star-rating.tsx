"use client"
import { Star } from "lucide-react"

interface StarRatingProps {
	rating: number
	maxRating?: number
}

export function FPStarRating({ rating, maxRating = 5 }: StarRatingProps) {
	return (
		<div className="flex">
			{[...Array(maxRating)].map((_, index) => {
				const fillPercentage = Math.min(
					Math.max((rating - index) * 100, 0),
					100
				)
				return (
					<div key={index} className="relative">
						<Star className="h-4 w-4 fill-transparent stroke-1 text-yellow-400 lg:h-5 lg:w-5" />
						<div
							className="absolute inset-0 overflow-hidden"
							style={{ width: `${fillPercentage}%` }}
						>
							<Star className="h-4 w-4 fill-yellow-400 stroke-1 text-yellow-400 lg:h-5 lg:w-5" />
						</div>
					</div>
				)
			})}
		</div>
	)
}
