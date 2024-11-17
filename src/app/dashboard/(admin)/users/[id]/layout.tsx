import { DashboardHeader } from "@/app/_components/header"

export default async function UserLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<DashboardHeader />
			{children}
		</>
	)
}
