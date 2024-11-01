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
import { auth } from "@/auth"
import { redirect } from "next/navigation"

const getNotificationsByEmail = async (email: string) => {
	return null
}

export const metadata: Metadata = {
	title: "Notifications"
}

export default async function Page() {
	const session = await auth()
	const notifications = getNotificationsByEmail(session?.user.email || "")

	return (
		<Card className="">
			<CardHeader className="p-4 lg:p-6">
				<CardTitle>Notifications</CardTitle>
				<CardDescription></CardDescription>
			</CardHeader>
			<CardContent className="p-4 pt-0 lg:p-6 lg:pt-0">
				<Suspense fallback={<DataTableSkeleton />}>
					{/* <DataTable data={usersPromise} /> */}
				</Suspense>
			</CardContent>
		</Card>
	)
}
