import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getPendingFarmersUseCase } from "@/use-cases/users"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { DataTable } from "../_components/data-table"
import { columns } from "./_components/columns"

const getPendingFarmers = async () => {
	return await getPendingFarmersUseCase()
}

const UsersPage = async () => {
	const session = await auth()
	if (!session || session.user.role !== "ADMIN") {
		redirect("/login")
	}

	const users = await getPendingFarmers()

	return (
		<>
			<Card className="">
				<CardHeader className="p-4 lg:p-6">
					<CardTitle>Farmers Waiting for Approval</CardTitle>
					<CardDescription>Manage pending farmers</CardDescription>
				</CardHeader>
				<CardContent className="p-4 pt-0 lg:p-6 lg:pt-0">
					<DataTable columns={columns} data={users} />
				</CardContent>
			</Card>
		</>
	)
}

export default UsersPage
