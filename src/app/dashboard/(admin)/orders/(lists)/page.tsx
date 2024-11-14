import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Suspense } from "react"
import { DataTableSkeleton } from "@/app/dashboard/_components/data-table-skeleton"
import { Metadata } from "next"
import ProductTable from "./_components/data-table"
import { Header } from "@/app/_components/header"

const getAllOrders = async () => {}

export const metadata: Metadata = {
	title: "Orders"
}
export default async function Page() {
	const orders = await getAllOrders()
	return (
		<>
			<Header />
			<div className="space-y-2 p-2 lg:space-y-4 lg:p-5">
				<Card className="">
					<CardHeader className="p-4 lg:p-6">
						<CardTitle>Orders</CardTitle>
						<CardDescription>Manage orders</CardDescription>
					</CardHeader>
					<CardContent className="p-4 pt-0 lg:p-6 lg:pt-0">
						<Suspense fallback={<DataTableSkeleton />}>
							<ProductTable />
						</Suspense>
					</CardContent>
				</Card>
			</div>
		</>
	)
}
