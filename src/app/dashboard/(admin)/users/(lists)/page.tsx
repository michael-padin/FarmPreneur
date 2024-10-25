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

const getUsers = async () => {
	return await getUsersUseCase()
}

// After
type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export async function generateMetadata(props: {
	params: Params
	searchParams: SearchParams
}) {
	const searchParams = await props.searchParams
	const query = searchParams
}

const UsersPage = async () => {
	const session = await auth()
	if (!session || session.user.role !== "ADMIN") {
		redirect("/login")
	}

	const users = await getUsers()

	return (
		<>
			<Card className="">
				<CardHeader className="p-4 lg:p-6">
					<CardTitle>All Users</CardTitle>
					<CardDescription>Manage users.</CardDescription>
				</CardHeader>
				<CardContent className="p-4 pt-0 lg:p-6 lg:pt-0">
					<DataTable columns={columns} data={users} />
				</CardContent>
			</Card>
		</>
	)
}

export default UsersPage
