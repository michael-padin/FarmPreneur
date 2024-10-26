import { DataTable } from "./_components/data-table"
import { columns } from "./_components/columns"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getUsersUseCase } from "@/use-cases/users"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Suspense } from "react"
import { DataTableSkeleton } from "@/app/dashboard/_components/data-table-skeleton"

const getUsers = async () => {
	return await getUsersUseCase()
}

export async function generateMetadata() {}

const UsersPage = async () => {
	const session = await auth()
	if (!session || session.user.role !== "ADMIN") {
		redirect("/login")
	}

	const usersPromise = getUsers()

	return (
		<>
			<Card className="">
				<CardHeader className="p-4 lg:p-6">
					<CardTitle>All Users</CardTitle>
					<CardDescription>Manage users.</CardDescription>
				</CardHeader>
				<CardContent className="p-4 pt-0 lg:p-6 lg:pt-0">
					<Suspense fallback={<DataTableSkeleton />}>
						<DataTable data={usersPromise} />
					</Suspense>
				</CardContent>
			</Card>
		</>
	)
}

export default UsersPage
