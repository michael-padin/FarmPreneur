import { DashboardHeader } from "@/app/_components/header"
import { UsersNav } from "./_components/users-nav"

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<DashboardHeader />
			<div className="space-y-4 px-4 py-5 lg:px-5">
				<UsersNav />
				<div>{children}</div>
			</div>
		</>
	)
}
