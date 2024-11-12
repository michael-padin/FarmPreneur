import { Header } from "@/app/_components/header"
import { UsersNav } from "./_components/users-nav"

export default async function Layout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<Header />
			<div className="space-y-2 p-2 lg:space-y-4 lg:p-5">
				<UsersNav />
				<div>{children}</div>
			</div>
		</>
	)
}
