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
			<div className="px-1 py-5 lg:p-5">
				<UsersNav />
				<div className="px-2 lg:px-0">{children}</div>
			</div>
		</>
	)
}
