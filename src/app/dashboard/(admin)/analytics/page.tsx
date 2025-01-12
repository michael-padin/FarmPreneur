import { AnalyticsDashboard } from "./_components/analytics-dashboard"

export const experimental_ppr = true

export default function AnalyticsPage() {
	return (
		<>
			<div className="space-y-4 bg-secondary px-4 py-5 dark:bg-background lg:px-5">
				<div className="flex items-center justify-between space-y-2">
					<h2 className="text-2xl font-semibold leading-none tracking-tight">{`Analytics`}</h2>
				</div>
				<AnalyticsDashboard />
			</div>
		</>
	)
}
