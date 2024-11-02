import { auth } from "@/auth"
import { BottomNav } from "./_components"
import { redirect } from "next/navigation"

export default async function Layout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await auth()
	const user = session?.user

	if (user?.role === "FARMER") redirect("/dashboard/farmer")
	if (user?.role === "ADMIN") redirect("/dashboard")
	return (
		<div>
			{children}
			<div className="lg:hidden">
				<BottomNav />
			</div>
		</div>
	)
}
