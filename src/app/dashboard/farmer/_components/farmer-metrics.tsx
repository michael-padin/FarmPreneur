import { getFarmerMetricsUseCase } from "@/use-cases/farmers"
import { FarmerMetricCard } from "./farmer-metric-card"

export async function FarmerMetrics() {
	const {
		orders: {
			completedOrdersCount,
			pendingOrdersCount,
			totalOrders,
			inProgressOrdersCount
		},
		products: { categoriesCount, totalProducts },
		revenue: { totalRevenue, revenueGrowthPercentage },
		rating: { averageRating, totalReviews }
	} = await getFarmerMetricsUseCase()

	return (
		<>
			<FarmerMetricCard
				variant="products"
				title="Total Products"
				value={`${totalProducts}`}
				subValue={`${categoriesCount} ${categoriesCount === 1 ? "category" : "categories"} `}
			/>
			<FarmerMetricCard
				variant="orders"
				title="Total Orders"
				value={`${totalOrders}`}
				subValue={`${pendingOrdersCount} Pending • ${inProgressOrdersCount} In Progress • ${completedOrdersCount} Completed`}
			/>
			<FarmerMetricCard
				title="Total Revenue"
				value={` ₱${totalRevenue}`}
				subValue={`${revenueGrowthPercentage > 0 ? "↑" : ""} ${revenueGrowthPercentage.toFixed(0)}% from last month`}
				variant="revenue"
			/>
			<FarmerMetricCard
				title="Average Rating"
				value={`${averageRating} / 5.0`}
				subValue={`Based on ${totalReviews} reviews`}
				variant="rating"
			/>
		</>
	)
}
