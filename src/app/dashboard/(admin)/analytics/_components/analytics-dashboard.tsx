"use client"
import { useState } from "react"
import { DateRange } from "react-day-picker"
import { CustomerGrowth } from "./customer-growth"
import { FarmerApplicationStatus } from "./farmer-application-status"
import { OrderStatusOverview } from "./order-status-overview"
import { OrderTrends } from "./order-trends"
import { ProductCategoryDistribution } from "./product-category-distribution"
import { ProductListingStatus } from "./product-listing-status"
import { RevenueTrends } from "./revenue-trends"
import { SalesTrends } from "./sales"
import { UserRoleDistribution } from "./user-role-distribution"

export const AnalyticsDashboard = () => {
	const [dateRange, setDateRange] = useState<DateRange | undefined>({
		from: new Date(2023, 0, 1),
		to: new Date()
	})

	const handleDateRangeChange = (range: DateRange | undefined) => {
		setDateRange(range)
	}
	return (
		<>
			<div className="grid gap-4">
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					<UserRoleDistribution dateRange={dateRange} />
					<FarmerApplicationStatus dateRange={dateRange} />
					<ProductListingStatus dateRange={dateRange} />
					<ProductCategoryDistribution dateRange={dateRange} />
					<OrderStatusOverview dateRange={dateRange} />
				</div>
				<CustomerGrowth />
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
					<OrderTrends dateRange={dateRange} />
					<RevenueTrends dateRange={dateRange} />
					<SalesTrends dateRange={dateRange} />
				</div>
			</div>
		</>
	)
}
