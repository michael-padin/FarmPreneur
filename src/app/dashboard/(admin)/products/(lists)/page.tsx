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
import { AddProductSheet } from "./_components/add-product-sheet"
import { getCategoriesUseCase } from "@/use-cases/categories"
import { getApprovedFarmersUseCase } from "@/use-cases/farmers"

const getAllProducts = async () => {
	return await getAllProductsUseCase()
}

const getCategories = async () => {
	return await getCategoriesUseCase()
}
const getApprovedFarmers = async () => {
	return await getApprovedFarmersUseCase()
}

export const metadata: Metadata = {
	title: "Products"
}
export default async function Page() {
	const products = getAllProducts()
	const categoriesPromise = getCategories()
	const approvedFarmersPromise = getApprovedFarmers()
	return (
		<>
			<Header />
			<div className="space-y-2 p-2 lg:space-y-4 lg:p-5">
				<Card className="">
					<CardHeader className="p-4 lg:p-6">
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Products</CardTitle>
								<CardDescription>Manage products from farmers</CardDescription>
							</div>
							<div>
								<AddProductSheet
									categoriesPromise={categoriesPromise}
									approvedFarmersPromise={approvedFarmersPromise}
								/>
							</div>
						</div>
					</CardHeader>
					<CardContent className="p-4 pt-0 lg:p-6 lg:pt-0">
						<Suspense fallback={<DataTableSkeleton />}>
							<DataTable data={products} />
						</Suspense>
					</CardContent>
				</Card>
			</div>
		</>
	)
}
