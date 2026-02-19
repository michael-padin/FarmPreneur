import { DashboardHeader } from "@/app/_components/header"
import { FPBreadcrumbResponsive } from "@/components/fp/fp-breadcrumb"
import { Metadata } from "next"
import { NotificationList } from "./_components/notification-list"

export const metadata: Metadata = {
	title: "Notifications"
}

//export const experimental_ppr = true

export default function Page() {
	const breadcrumbItems = [
		{ href: "/dashboard", label: "Dashboard" },
		{ label: "Notifications" }
	]

	return (
		<>
			<DashboardHeader />
			<div className="space-y-4 px-4 py-5 lg:px-5">
				<FPBreadcrumbResponsive items={breadcrumbItems} itemsToDisplay={2} />
				<NotificationList />
			</div>
		</>
	)
}
