import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getOverviewMetrics } from "@/data-access/general"
import {
	Box,
	ChartNoAxesCombined,
	LayoutGrid,
	Leaf,
	PhilippinePeso,
	Star,
	Users
} from "lucide-react"
import { AbsoluteChange } from "./absolute-change"

export async function OverviewMetrics() {
	const {
		orders: {
			ordersChange,
			totalOrders,
			totalPendingOrders,
			totalInProgressOrders,
			totalCompletedOrders,
			totalCancelledOrders
		},
		products: {
			productsChange,
			totalProducts,
			totalPendingProducts,
			totalApprovedProducts,
			totalRejectedProducts,
			totalUnlistedProducts
		},
		categories: { totalCategories },
		users: {
			usersChange,
			totalUsers,
			totalAdmins,
			totalCustomers,
			totalFarmers
		},
		sales: { totalSales, salesChange },
		revenue: { totalRevenue, revenueChange },
		rating: { averageRating, totalReviews }
	} = await getOverviewMetrics()

	return (
		<>
			<Card className="border-none shadow-none transition-shadow hover:shadow-lg">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Total Users
					</CardTitle>
					<Users className="h-5 w-5 text-primary" />
				</CardHeader>
				<CardContent className="p-3 pt-0">
					<div className="text-3xl font-bold">{totalUsers}</div>
					<div className="flex flex-wrap items-center gap-1 text-xs">
						<div className="flex gap-2 p-1 text-purple-600">
							<div className="">{totalAdmins}</div>
							<div className="flex items-center">Admins</div>
						</div>
						<Separator orientation="vertical" className="h-4" />
						<div className="flex gap-2 p-1 text-green-600">
							<div className="">{totalFarmers}</div>
							<div className="flex items-center">Farmers</div>
						</div>
						<Separator orientation="vertical" className="h-4" />
						<div className="flex gap-2 p-1 text-blue-600">
							<div className="">{totalCustomers}</div>
							<div className="flex items-center">Customers</div>
						</div>
					</div>
					<AbsoluteChange change={usersChange} />
				</CardContent>
			</Card>
			<Card className="border-none shadow-none transition-shadow hover:shadow-lg">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Total Products
					</CardTitle>
					<Leaf className="h-5 w-5 text-primary" />
				</CardHeader>
				<CardContent className="p-3 pt-0">
					<div className="text-3xl font-bold">{totalProducts}</div>
					<div className="flex flex-wrap items-center gap-1 text-xs">
						<div className="flex gap-2 p-1 text-yellow-600">
							<div className="">{totalPendingProducts}</div>
							<div className="flex items-center">Pending</div>
						</div>
						<Separator orientation="vertical" className="h-4" />
						<div className="flex gap-2 p-1 text-green-600">
							<div className="">{totalApprovedProducts}</div>
							<div className="flex items-center">Approved</div>
						</div>
						<Separator orientation="vertical" className="h-4" />
						<div className="flex gap-2 p-1 text-red-600">
							<div className="">{totalRejectedProducts}</div>
							<div className="flex items-center">Rejected</div>
						</div>
						<Separator orientation="vertical" className="h-4" />
						<div className="flex gap-2 p-1 text-muted-foreground">
							<div className="">{totalUnlistedProducts}</div>
							<div className="flex items-center">Unlisted</div>
						</div>
					</div>
					<AbsoluteChange change={productsChange} />
				</CardContent>
			</Card>

			<Card className="border-none shadow-none transition-shadow hover:shadow-lg">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Total Orders
					</CardTitle>
					<Box className="h-5 w-5 text-primary" />
				</CardHeader>
				<CardContent className="p-3 pt-0">
					<div className="text-3xl font-bold">{totalOrders}</div>
					<div className="flex flex-wrap items-center gap-1 text-xs">
						<div className="flex gap-2 p-1 text-yellow-600">
							<div className="">{totalPendingOrders}</div>
							<div className="flex items-center">Pending</div>
						</div>
						<Separator orientation="vertical" className="h-4" />
						<div className="flex gap-2 p-1 text-blue-600">
							<div className="">{totalInProgressOrders}</div>
							<div className="flex items-center">In progress</div>
						</div>
						<Separator orientation="vertical" className="h-4" />
						<div className="flex gap-2 p-1 text-green-500">
							<div className="">{totalCompletedOrders}</div>
							<div className="flex items-center">Completed</div>
						</div>
						<Separator orientation="vertical" className="h-4" />
						<div className="flex gap-2 p-1 text-red-600">
							<div className="">{totalCancelledOrders}</div>
							<div className="flex items-center">Cancelled</div>
						</div>
					</div>
					<AbsoluteChange change={ordersChange} />
				</CardContent>
			</Card>

			<Card className="border-none shadow-none transition-shadow hover:shadow-lg">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Total Revenue
					</CardTitle>
					<PhilippinePeso className="h-5 w-5 text-primary" />
				</CardHeader>
				<CardContent className="p-3 pt-0">
					<div className="text-3xl font-bold">₱{totalRevenue}</div>
					<div className="h-6"></div>
					<AbsoluteChange change={revenueChange} type="currency" />
				</CardContent>
			</Card>
			<Card className="border-none shadow-none transition-shadow hover:shadow-lg">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Total Sales
					</CardTitle>
					<ChartNoAxesCombined className="h-5 w-5 text-primary" />
				</CardHeader>
				<CardContent className="p-3 pt-0">
					<div className="text-3xl font-bold">{totalSales}</div>
					<div className="h-6"></div>
					<AbsoluteChange change={salesChange} />
				</CardContent>
			</Card>

			<Card className="border-none shadow-none transition-shadow hover:shadow-lg">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Total Categories
					</CardTitle>
					<LayoutGrid className="h-5 w-5 text-primary" />
				</CardHeader>
				<CardContent className="p-3 pt-0">
					<div className="text-3xl font-bold">{totalCategories}</div>
					<div className="h-6"></div>
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
					<div className="h-6"></div>
					<p className="mt-1 text-sm text-muted-foreground">
						Based on {totalReviews} reviews
					</p>
				</CardContent>
			</Card>
		</>
	)
}
