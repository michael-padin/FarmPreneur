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

const getAllProducts = async () => {}

export const metadata: Metadata = {
	title: "Products"
}
export default async function Page() {
	const orders = await getAllProducts()
	return (
		<>
			<Card className="">
				<CardHeader className="p-4 lg:p-6">
					<CardTitle>Products</CardTitle>
					<CardDescription>Manage products from farmers</CardDescription>
				</CardHeader>
				<CardContent className="p-4 pt-0 lg:p-6 lg:pt-0">
					<Suspense fallback={<DataTableSkeleton />}></Suspense>
				</CardContent>
			</Card>
		</>
	)
}
