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
			<div className="space-y-2 p-2 lg:space-y-4 lg:p-5">
				<Card>
					<CardHeader className="">
						<CardTitle>Notifications</CardTitle>
						<CardDescription></CardDescription>
					</CardHeader>
					<CardContent className="">
						<Suspense fallback={<DataTableSkeleton />}>
							{/* <DataTable data={usersPromise} /> */}
						</Suspense>
					</CardContent>
				</Card>
			</div>
		</>
	)
}
