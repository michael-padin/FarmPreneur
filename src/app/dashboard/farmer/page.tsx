import { Suspense } from "react"
import { BottomNav } from "./_components/bottom-navigation"
import { FarmerMetricCardSkeleton } from "./_components/farmer-metric-card-skeleton"
import { FarmerMetrics } from "./_components/farmer-metrics"
import { Greetings } from "./_components/greeting"
import { ProfilePicture } from "./_components/profile-picture"

export const experimental_ppr = true

export default function FarmerDashboard() {
	return (
		<>
			<div className="h-screen w-full overflow-auto bg-secondary p-4 lg:px-5">
				<header className="pb-4">
					<div className="flex items-center justify-between">
						<div>
							<h2 className={`text-xs font-bold ${"text-primary"}`}>
								FarmPreneur
							</h2>
							<Greetings />
							<p className="text-sm text-muted-foreground">
								Here is an overview of your farm.
							</p>
						</div>
						<ProfilePicture />
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
			</div>
			<BottomNav />
		</>
	)
}
