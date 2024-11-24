import { DashboardHeader } from "@/app/_components/header"
import { Suspense } from "react"
import { TotalUsers } from "../_components/total-users"
import { TotalProducts } from "../_components/total-products"
import { TotalOrders } from "../_components/total-orders"
import { AverageRating } from "../_components/average-rating"

export default function AdminDashboardPage() {
	// const totalOrders = getTotalOrdersUseCase()
	// const totalProducts = getTotalProductsUseCase()
	// const topProducts = getTopProductsUseCase()
	// const topPerformingFarmers = getTopPerformingFarmersUseCase()

	return (
		<div>
			<DashboardHeader />
			<div className="space-y-4 px-4 py-5 lg:px-5">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-semibold leading-none tracking-tight">
						Dashboard
					</h2>
				</div>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Suspense fallback={<p>Loading...</p>}>
						<TotalUsers />
					</Suspense>
					<Suspense fallback={<p>Loading...</p>}>
						<TotalProducts />
					</Suspense>
					<Suspense fallback={<p>Loading...</p>}>
						<TotalOrders />
					</Suspense>
					<Suspense fallback={<p>Loading...</p>}>
						<AverageRating />
					</Suspense>
				</div>
				{/* <DashUI2 /> */}
			</div>
		</div>
	)
}
