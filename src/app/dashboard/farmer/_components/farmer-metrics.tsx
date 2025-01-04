import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getFarmerMetricsUseCase } from "@/use-cases/farmers"
import {
	ArrowDown,
	ArrowUp,
	Box,
	PhilippinePeso,
	ShoppingCart,
	Star
} from "lucide-react"

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
			<div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
				{/* Products Card */}
				<Card className="border-none shadow-none transition-shadow hover:shadow-lg">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Total Products
						</CardTitle>
						<Box className="h-5 w-5 text-primary" />
					</CardHeader>
					<CardContent className="p-3 pt-0">
						<div className="text-3xl font-bold">{totalProducts}</div>
						<p className="mt-1 text-sm text-muted-foreground">
							{categoriesCount} categories
						</p>
					</CardContent>
				</Card>

				{/* Orders Card */}
				<Card className="border-none shadow-none transition-shadow hover:shadow-lg">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Total Orders
						</CardTitle>
						<ShoppingCart className="h-5 w-5 text-primary" />
					</CardHeader>
					<CardContent className="p-3 pt-0">
						<div className="text-3xl font-bold">{totalOrders}</div>
						<div className="mt-1 flex gap-2 text-sm text-muted-foreground">
							<span>{pendingOrdersCount} Pending</span>
							<span>•</span>
							<span>{inProgressOrdersCount} In Progress</span>
							<span>•</span>
							<span>{completedOrdersCount} Completed</span>
						</div>
					</CardContent>
				</Card>

				{/* Revenue Card */}
				<Card className="border-none shadow-none transition-shadow hover:shadow-lg">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Total Revenue
						</CardTitle>
						<PhilippinePeso className="h-5 w-5 text-primary" />
					</CardHeader>
					<CardContent className="p-3 pt-0">
						<div className="text-3xl font-bold">₱{totalRevenue}</div>
						{revenueGrowthPercentage > 0 ? (
							<p className="mt-1 flex items-center gap-1 text-sm text-primary">
								<ArrowUp className="h-5 w-5" />
								{revenueGrowthPercentage.toFixed(0)}% from last month
							</p>
						) : (
							<p className="mt-1 flex items-center gap-1 text-sm text-destructive">
								<ArrowDown className="h-5 w-5" />
								{revenueGrowthPercentage.toFixed(0)}% from last month
							</p>
						)}
					</CardContent>
				</Card>

				{/* Rating Card */}
				<Card className="border-none shadow-none transition-shadow hover:shadow-lg">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Average Rating
						</CardTitle>
						<Star className="h-5 w-5 text-primary" />
					</CardHeader>
					<CardContent className="p-3 pt-0">
						<div className="text-3xl font-bold">
							{averageRating.toFixed(1)} / 5.0
						</div>
						<p className="mt-1 text-sm text-muted-foreground">
							Based on {totalReviews} reviews
						</p>
					</CardContent>
				</Card>
			</div>
		</>
	)
}
