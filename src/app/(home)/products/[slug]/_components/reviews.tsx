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
				<div className="flex items-center gap-1 text-xl">
					<Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
					<span className="font-bold">
						{reviews.averageRating?.toFixed(1)}
						<span className="font-normal">({reviews.totalReviews})</span>
					</span>
					Ratings
				</div>
				{/* <button className="text-primary">View All</button> */}
			</div>

			{/* <ReviewMetadata items={metadata} /> */}

			<div className="">
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
