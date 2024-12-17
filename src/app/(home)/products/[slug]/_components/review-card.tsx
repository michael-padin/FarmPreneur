"use client"
import { getProductReviews } from "@/use-cases/products"
import { formatDistanceToNow } from "date-fns"
import { Star } from "lucide-react"
import Image from "next/image"

interface ReviewCardProps {
	review: Awaited<ReturnType<typeof getProductReviews>>["reviews"][0]
	onHelpfulClick?: (reviewId: string) => void
	helpfulCount?: number
}

export function ReviewCard({
	review,
	onHelpfulClick,
	helpfulCount
}: ReviewCardProps) {
	return (
		<div className="py-4">
			<div className="mb-2 flex items-center justify-between">
				<div className="flex items-center gap-2">
					{review.customer?.profilePicture ? (
						<Image
							src={review.customer?.profilePicture}
							alt={`Reviewer's profile picture`}
							width={32}
							height={32}
							className="rounded-full object-cover"
							sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
						/>
					) : (
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
							{review.customerId?.charAt(0)}
						</div>
					)}
					<span className="font-medium">
						{review.customer?.name || review.customer?.user.name}
					</span>
				</div>
				{/* <Button
					variant="ghost"
					onClick={() => onHelpfulClick?.(review.id)}
					className="text-muted-foreground"
				>
					Helpful ({helpfulCount})
				</Button> */}
			</div>

			<div className="mb-2 flex gap-1">
				{Array.from({ length: 5 }).map((_, i) => (
					<Star
						key={i}
						className={`h-4 w-4 ${
							i < review.rating
								? "fill-yellow-500 stroke-yellow-500 text-yellow-500"
								: "fill-transparent text-muted-foreground"
						}`}
					/>
				))}
			</div>

			{/* {review.product.variant && (
				<p className="mb-2 text-sm text-muted-foreground">
					Variation: {review.product.variant}
				</p>
			)} */}

			{review.comment && <p className="mb-4 text-sm">{review.comment}</p>}

			{review.images.length > 0 && (
				<div className="mb-4 flex gap-2">
					{review.images.map((image, index) => (
						<div
							key={index}
							className="relative h-24 w-24 overflow-hidden rounded-lg"
						>
							<Image
								src={image}
								alt={`Review image ${index + 1}`}
								fill
								className="object-cover"
							/>
						</div>
					))}
				</div>
			)}

			<div className="text-sm text-muted-foreground">
				{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
			</div>
		</div>
	)
}
