import { BottomNav } from "./_components/bottom-navigation"
import { Suspense } from "react"
import { Greetings } from "../_components/greeting"
import { MessageCircleMore } from "lucide-react"
import { FarmerMetrics } from "./_components/farmer-metrics"
import { FarmerMetricCardSkeleton } from "./_components/farmer-metric-card-skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const experimental_ppr = true

export default function FarmerDashboard() {
	return (
		<>
			<div className="w-full p-4 lg:px-5">
				<header className="pb-4">
					<div className="flex items-center justify-between">
						<div>
							<Greetings />
							<p className="text-sm text-muted-foreground">
								Here is an overview of your farm.
							</p>
						</div>
						<MessageCircleMore className="text-primary" />
					</div>
				</header>
				<div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
					<Suspense
						fallback={
							<>
								<FarmerMetricCardSkeleton />
								<FarmerMetricCardSkeleton />
								<FarmerMetricCardSkeleton />
								<FarmerMetricCardSkeleton />
							</>
						}
					>
						<FarmerMetrics />
					</Suspense>
				</div>
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-6 lg:grid-rows-2">
					{/* <div className="lg:col-span-6 lg:row-span-2">
						<Card className="h-full">
							<CardHeader>
								<CardTitle>Recent Orders</CardTitle>
							</CardHeader>
							<CardContent className="">
								<Suspense fallback={<Skeleton className="h-24" />}>
									<RecentOrdersTable data={recentOrdersPromise} />
								</Suspense>
							</CardContent>
						</Card>
					</div> */}
					{/* <Card className="lg:col-span-2 lg:row-span-2">
						<CardHeader>
							<div className="flex items-center justify-between">
								<div className="space-y-1.5">
									<CardTitle className="flex items-center gap-2">
										<Bell />
										Notifications
									</CardTitle>
								</div>
								<div>
									<Link
										href="/dashboard/products?status=pending"
										className={cn(
											buttonVariants({ variant: "link" }),
											"hidden lg:inline-flex"
										)}
									>
										View All
									</Link>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<Suspense fallback={<p>Loading...</p>}>
								<Notifications />
							</Suspense>
						</CardContent>
					</Card> */}
				</div>
				{/* <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					
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
				</div> */}
			</div>
			<BottomNav />
		</>
	)
}
