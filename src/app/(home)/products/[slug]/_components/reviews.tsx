"use client"
import { getProductReviews } from "@/use-cases/products"
import { Star } from "lucide-react"
import { ReviewCard } from "./review-card"

const Reviews = ({
	reviews
}: {
	reviews: Awaited<ReturnType<typeof getProductReviews>>
}) => {
	return (
		<>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="text-2xl font-bold">{reviews.averageRating}</span>
					<Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />
					<span className="text-lg">
						Product Ratings ({reviews.totalReviews})
					</span>
				</div>
				{/* <button className="text-primary">View All</button> */}
			</div>

			{/* <ReviewMetadata items={metadata} /> */}

			<div className="space-y-2">
				{reviews.reviews.map((review) => (
					<ReviewCard
						key={review.id}
						review={review}
						onHelpfulClick={(id) => console.log("Marked as helpful:", id)}
						helpfulCount={review.id === "1" ? 5 : 11}
					/>
				))}
			</div>
		</>
	)
}

export default Reviews
