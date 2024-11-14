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
import { DataTable } from "./_components/data-table"
import { getAllProductsUseCase } from "@/use-cases/products"
import { Header } from "@/app/_components/header"

const getAllProducts = async () => {
	return await getAllProductsUseCase()
}

export const metadata: Metadata = {
	title: "Products"
}
export default async function Page() {
	const orders = getAllProducts()
	return (
		<>
			<Header />
			<div className="space-y-2 p-2 lg:space-y-4 lg:p-5">
				<Card className="">
					<CardHeader className="p-4 lg:p-6">
						<CardTitle>Products</CardTitle>
						<CardDescription>Manage products from farmers</CardDescription>
					</CardHeader>
					<CardContent className="p-4 pt-0 lg:p-6 lg:pt-0">
						<Suspense fallback={<DataTableSkeleton />}>
							<DataTable data={orders} />
						</Suspense>
					</CardContent>
				</Card>
			</div>
		</>
	)
}
