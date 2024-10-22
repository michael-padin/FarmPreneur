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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const getUsers = unstable_cache(async () => {
	return await getUsersUseCase()
})

const UsersPage = async () => {
	const session = await auth()
	if (!session || session.user.role !== "ADMIN") {
		redirect("/login")
	}

	const tabData = [
		{ id: "all", label: "All" },
		{ id: "customers", label: "Customers" },
		{ id: "farmers", label: "Farmers" },
		{ id: "farmer-approval", label: "Farmer Approval" }
	]
	const users = await getUsers()

	return (
		<div className="px-2 py-5 lg:p-5">
			<Tabs defaultValue="all">
				<TabsList className="flex w-full lg:w-[500px]">
					{tabData.map((tab) => (
						<>
							<TabsTrigger
								key={tab.id}
								value={tab.id}
								className="w-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
							>
								{tab.label}
							</TabsTrigger>
						</>
					))}
				</TabsList>
				<TabsContent value="all">
					<Card>
						<CardHeader>
							<CardTitle>User Management</CardTitle>
							<CardDescription>Manager your users.</CardDescription>
						</CardHeader>
						<CardContent className="">
							<DataTable columns={columns} data={users} />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default UsersPage
