import { DashboardHeader } from "@/app/_components/header"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getRecentOrdersUseCase } from "@/use-cases/orders"
import { Suspense } from "react"
import { FarmerMetricCardSkeleton } from "../../farmer/_components/farmer-metric-card-skeleton"
import { GreetingsWrapper } from "./_components/greetings-wrapper"
import { OverviewMetrics } from "./_components/overview-metrics"
import { RecentOrdersTable } from "./_components/recent-orders/data-table"
import { TopFarmers } from "./_components/top-farmers"
import TopFarmProducts from "./_components/top-selling-produce"

//export const experimental_ppr = true

export default function AdminDashboardPage() {
	const recentOrdersPromise = getRecentOrdersUseCase()
	return (
		<div>
			<DashboardHeader />
			<div className="space-y-4 bg-secondary px-4 py-5 dark:bg-background lg:px-5">
				<div>
					<Suspense fallback={<Skeleton className="h-6 w-full" />}>
						<GreetingsWrapper />
					</Suspense>
					<p className="text-sm text-muted-foreground">
						Here is an overview of the marketplace.
					</p>
				</div>
				<div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
					<Suspense
						fallback={
							<>
								<FarmerMetricCardSkeleton />
								<FarmerMetricCardSkeleton />
								<FarmerMetricCardSkeleton />
								<FarmerMetricCardSkeleton />
								<FarmerMetricCardSkeleton />
								<FarmerMetricCardSkeleton />
								<FarmerMetricCardSkeleton />
							</>
						}
					>
						<OverviewMetrics />
					</Suspense>
				</div>
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-6 lg:grid-rows-2">
					<div className="lg:col-span-6 lg:row-span-2">
						<Card className="h-full">
							<CardHeader>
								<CardTitle>Recent Orders</CardTitle>
								<CardDescription>
									Recent orders in the marketplace
								</CardDescription>
							</CardHeader>
							<CardContent className="">
								<Suspense fallback={<Skeleton className="h-24" />}>
									<RecentOrdersTable data={recentOrdersPromise} />
								</Suspense>
							</CardContent>
						</Card>{" "}
					</div>
				</div>
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					<Card className="h-full">
						<CardHeader>
							<CardTitle>Top Farmers</CardTitle>
						</CardHeader>
						<CardContent className="">
							<Suspense
								fallback={
									<div className="space-y-2">
										<Skeleton className="h-24" />
										<Skeleton className="h-24" />
									</div>
								}
							>
								<TopFarmers />
							</Suspense>
						</CardContent>
					</Card>
					<Card className="h-full">
						<CardHeader>
							<CardTitle>Top Farm Produce</CardTitle>
						</CardHeader>
						<CardContent className="">
							<Suspense
								fallback={
									<div className="space-y-2">
										<Skeleton className="h-24" />
										<Skeleton className="h-24" />
									</div>
								}
							>
								<TopFarmProducts />
							</Suspense>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
