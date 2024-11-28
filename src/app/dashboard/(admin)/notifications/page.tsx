import { Metadata } from "next"
import { DashboardHeader } from "@/app/_components/header"
import { auth } from "@/auth"
import { BreadcrumbResponsive } from "@/components/fg/back-button"
import { NotificationList } from "./_components/notification-list"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"

export const metadata: Metadata = {
	title: "Notifications"
}

export default async function Page() {
	const session = await auth()
	const user = session?.user

	if (!user) {
		return <div>You are not logged in</div>
	}

	const breadcrumbItems = [
		{ href: "/dashboard", label: "Dashboard" },
		{ label: "Notifications" }
	]

	return (
		<>
			<DashboardHeader />
			<div className="space-y-4 px-4 py-5 lg:px-5">
				<BreadcrumbResponsive items={breadcrumbItems} itemsToDisplay={2} />
				<NotificationList />
			</div>
		</>
	)
}
