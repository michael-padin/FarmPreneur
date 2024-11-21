import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Suspense } from "react"
import { DataTableSkeleton } from "../../_components/data-table-skeleton"
import { Metadata } from "next"
import { DashboardHeader } from "@/app/_components/header"
import NotifUI1 from "./_components/notif-ui1"

const getNotificationsByEmail = () => {
	return null
}

export const metadata: Metadata = {
	title: "Notifications"
}

export default async function Page() {
	const notifications = getNotificationsByEmail()
	return (
		<>
			<DashboardHeader />
			<div className="space-y-4 px-4 py-5 lg:px-5">
				<Card>
					<CardHeader className="">
						<CardTitle>Notifications</CardTitle>
						<CardDescription></CardDescription>
					</CardHeader>
					<CardContent className="">
						<Suspense fallback={<DataTableSkeleton />}>
							{/* <DataTable data={usersPromise} /> */}
							<NotifUI1 />
							{/* <NotifUi2 /> */}
						</Suspense>
					</CardContent>
				</Card>
			</div>
		</>
	)
}
