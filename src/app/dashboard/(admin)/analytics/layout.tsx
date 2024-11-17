import { DashboardHeader } from "@/app/_components/header"

export default function AnalyticsLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<section>
			<DashboardHeader />
			{children}
		</section>
	)
}
