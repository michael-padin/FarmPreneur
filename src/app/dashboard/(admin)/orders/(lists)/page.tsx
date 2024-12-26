import { DashboardHeader } from "@/app/_components/header"
import { DataTableSkeleton } from "@/app/dashboard/_components/data-table-skeleton"
import { FPBreadcrumbResponsive } from "@/components/fp/fp-breadcrumb"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { getOrders } from "@/data-access/orders"
import { Metadata } from "next"
import { Suspense } from "react"
import { DataTable } from "./_components/data-table"

export const metadata: Metadata = {
	title: "Orders"
}
export default async function Page() {
	const ordersPromise = getOrders()
	const breadcrumbItems = [
		{ href: "/dashboard", label: "Dashboard" },
		{ label: "Pickup Orders" }
	]
	return (
		<div className="">
			<DashboardHeader />
			<div className="space-y-4 px-4 py-5 lg:px-5">
				<FPBreadcrumbResponsive items={breadcrumbItems} itemsToDisplay={2} />
				<Card className="">
					<CardHeader className="p-4 lg:p-6">
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Orders</CardTitle>
								<CardDescription>Manager and track orders</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="p-4 pt-0 lg:p-6 lg:pt-0">
						<Suspense fallback={<DataTableSkeleton columns={7} />}>
							<DataTable data={ordersPromise} />
						</Suspense>
					</CardContent>
				</Card>
				{/* <OrderTable /> */}
				{/* <OrderTable2 /> */}
				{/* <OrderUI3 /> */}
				{/* <OrderUI4 /> */}
				{/* <ProductTable /> */}
				{/* <OrderUI6 /> */}
			</div>
		</div>
	)
}
