import { DataTable } from "./_components/data-table"
import { columns } from "./_components/columns"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getUsersUseCase } from "@/use-cases/users"

const UsersPage = async () => {
	const session = await auth()
	if (!session || session.user.role !== "ADMIN") {
		redirect("/login")
	}

	const users = await getUsersUseCase()

	return (
		<div className="p-1 lg:p-4">
			<DataTable columns={columns} data={users} />
		</div>
	)
}

export default UsersPage
