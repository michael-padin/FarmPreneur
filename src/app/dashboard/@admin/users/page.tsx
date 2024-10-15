import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { DataTable } from "./_components/data-table"
import { columns } from "./_components/columns"

// Mock data for demonstration
const users = Array.from({ length: 1000 }, (_, i) => ({
	id: `${i + 1}`,
	name: `User ${i + 1}`,
	email: `user${i + 1}@example.com`,
	role: ["FARMER", "BUYER", "ADMIN"][Math.floor(Math.random() * 3)],
	isSellerApproved: Math.random() > 0.5,
	isVerified: Math.random() > 0.3,
	createdAt: new Date(
		Date.now() - Math.floor(Math.random() * 10000000000)
	).toISOString()
}))

const UsersPage = () => {
	return (
		<div className="p-1 lg:p-4">
			<Card className="">
				<CardHeader>
					<CardTitle>User Management</CardTitle>
				</CardHeader>
				<CardContent className="">
					<DataTable columns={columns} data={users} />
				</CardContent>
			</Card>
		</div>
	)
}

export default UsersPage
