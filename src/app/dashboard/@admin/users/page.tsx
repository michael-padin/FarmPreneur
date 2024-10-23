import { DataTable } from "./_components/data-table"
import { columns } from "./_components/columns"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getUsersUseCase } from "@/use-cases/users"
import { unstable_cache } from "next/cache"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"

const getUsers = unstable_cache(async () => {
	return await getUsersUseCase()
})

const UsersPage = async () => {
	const session = await auth()
	if (!session || session.user.role !== "ADMIN") {
		redirect("/login")
	}

	const users = await getUsers()

	return (
		<Card className="border-0 lg:border">
			<CardHeader className="p-4 lg:p-6">
				<CardTitle>All Users</CardTitle>
				<CardDescription>Manager users.</CardDescription>
			</CardHeader>
			<CardContent className="p-4 pt-0 lg:p-6 lg:pt-0">
				<DataTable columns={columns} data={users} />
			</CardContent>
		</Card>
	)
}

export default UsersPage
