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
import { DashboardHeader } from "@/app/_components/header"
import OrderTable from "./_components/order-ui"
import OrderTable2 from "./_components/order-ui-2"
import OrderUI3 from "./_components/order-ui-3"
import OrderUI4 from "./_components/order-ui-4"
import OrderUI6 from "./_components/order-ui-6"
import { getOrdersUseCase } from "@/use-cases/orders"
import { BreadcrumbResponsive } from "@/components/fg/back-button"

const getAllOrders = async () => {
	return await getOrdersUseCase()
}

export const metadata: Metadata = {
	title: "Orders"
}
export default async function Page() {
	const orders = await getAllOrders()
	const breadcrumbItems = [
		{ href: "/dashboard", label: "Dashboard" },
		{ label: "Pickup Orders" }
	]
	return (
		<div className="">
			<DashboardHeader />
			<div className="space-y-4 px-4 py-5 lg:px-5">
				<BreadcrumbResponsive items={breadcrumbItems} itemsToDisplay={2} />

				{/* <OrderTable /> */}
				{/* <OrderTable2 /> */}
				{/* <OrderUI3 /> */}
				<OrderUI4 />
				{/* <ProductTable /> */}
				{/* <OrderUI6 /> */}
			</div>
		</div>
	)
}
