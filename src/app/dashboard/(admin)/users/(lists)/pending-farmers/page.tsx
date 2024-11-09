import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getPendingFarmersUseCase } from "@/use-cases/farmers"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Suspense } from "react"
import { DataTableSkeleton } from "@/app/dashboard/_components/data-table-skeleton"
import { DataTable } from "./_components/data-table"
import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Pending Farmers"
}

const getPendingFarmers = async () => {
	return await getPendingFarmersUseCase()
}

const UsersPage = async () => {
	const session = await auth()
	if (!session || !session.user || session.user.role !== "ADMIN") {
		redirect("/login")
	}

	const pendingFarmersPromise = getPendingFarmers()

	return (
		<Card className="">
			<CardHeader className="p-4 lg:p-6">
				<CardTitle>Farmers Waiting for Approval</CardTitle>
				<CardDescription>Manage pending farmers</CardDescription>
			</CardHeader>
			<CardContent className="p-4 pt-0 lg:p-6 lg:pt-0">
				<Suspense fallback={<DataTableSkeleton />}>
					<DataTable data={pendingFarmersPromise} />
				</Suspense>
			</CardContent>
		</Card>
	)
}

export default UsersPage
