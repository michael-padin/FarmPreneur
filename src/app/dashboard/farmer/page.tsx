import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getUserFarmerByIdUseCase } from "@/use-cases/users"
import { Dashboard } from "./_components/client2"
import { BottomNav } from "./_components/bottom-navigation"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { TotalProducts } from "../_components/total-products"
import { TotalOrders } from "../_components/total-orders"
import { AverageRating } from "../_components/average-rating"
import { Greetings } from "../_components/greeting"
import { getRecentOrdersUseCase } from "@/use-cases/orders"

const getUserFarmer = async (id: string) => {
	const res = await getUserFarmerByIdUseCase(id)
	return res
}

export default async function FarmerDashboard() {
	const recentOrdersPromise = getRecentOrdersUseCase()

	return (
		<>
			{/* <Dashboard /> */}
			<div className="space-y-4 px-10 py-5 lg:px-5">
				<div>
					<Greetings />
					<p className="text-sm text-muted-foreground">
						Here is an overview of your marketplace.
					</p>
				</div>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Suspense fallback={<Skeleton className="h-24" />}>
						<TotalProducts />
					</Suspense>
					<Suspense fallback={<Skeleton className="h-24" />}>
						<TotalOrders />
					</Suspense>
					<Suspense fallback={<Skeleton className="h-24" />}>
						<AverageRating />
					</Suspense>
				</div>
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-6 lg:grid-rows-2">
					<div className="lg:col-span-6 lg:row-span-2">
						{/* <Card className="h-full">
							<CardHeader>
								<CardTitle>Recent Orders</CardTitle>
							</CardHeader>
							<CardContent className="">
								<Suspense fallback={<Skeleton className="h-24" />}>
									<RecentOrdersTable data={recentOrdersPromise} />
								</Suspense>
							</CardContent>
						</Card>{" "} */}
					</div>
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

				{/* <DashUI3 /> */}
			</div>
			<BottomNav />
		</>
	)
}
