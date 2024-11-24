import { StatsCard } from "./stats-card"
import { Star } from "lucide-react"
import { getProductReviewStatsUseCase } from "@/use-cases/products"

export async function AverageRating() {
	const productReviewStats = await getProductReviewStatsUseCase()

	return (
		<StatsCard
			Icon={Star}
			title="Average Rating"
			total={productReviewStats._avg.rating || 0}
			footerText={`${productReviewStats._count._all} total reviews`}
		/>
	)
}
