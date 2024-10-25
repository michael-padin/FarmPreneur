import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getCustomersUseCase } from "@/use-cases/users"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"

const getCustomers = async () => {
	return await getCustomersUseCase()
}

const CustomersPage = async () => {
	const session = await auth()
	if (!session || session.user.role !== "ADMIN") {
		redirect("/login")
	}

	const users = await getCustomers()

	if (users.length === 0) {
		return <div>No customers found</div>
	}

	return (
		<>
			<Card className="">
				<CardHeader className="p-4 lg:p-6">
					<CardTitle>Customers</CardTitle>
					<CardDescription>Manage customers account</CardDescription>
				</CardHeader>
				<CardContent className="p-4 pt-0 lg:p-6 lg:pt-0">
					<DataTable columns={columns} data={users} />
				</CardContent>
			</Card>
		</>
	)
}

export default CustomersPage
