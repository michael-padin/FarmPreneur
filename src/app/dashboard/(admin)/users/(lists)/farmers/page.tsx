import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getFarmersUseCase } from "@/use-cases/users"

import { Suspense } from "react"
import { DataTableSkeleton } from "@/app/dashboard/_components/data-table-skeleton"
import { DataTable } from "./_components/data-table"
import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Farmers"
}

const getFarmers = async () => {
	return await getFarmersUseCase()
}

const UsersPage = async () => {
	const session = await auth()
	if (!session || session.user.role !== "ADMIN") {
		redirect("/login")
	}
	const farmerListPromise = getFarmers()

	return (
		<Card className="">
			<CardHeader className="p-4 lg:p-6">
				<CardTitle>Farmers</CardTitle>
				<CardDescription>Manage farmers account</CardDescription>
			</CardHeader>
			<CardContent>
				<Suspense fallback={<DataTableSkeleton />}>
					<DataTable data={farmerListPromise} />
				</Suspense>
			</CardContent>
		</Card>
	)
}

export default UsersPage
