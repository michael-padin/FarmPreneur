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
import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const getAllProducts = async () => {
	return await getAllProductsUseCase()
}

export const metadata: Metadata = {
	title: "Products"
}
export default async function Page() {
	const products = getAllProducts()
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
								<Link
									href={"/dashboard/products/create"}
									className={cn(buttonVariants({ variant: "default" }))}
								>
									Add New Product
								</Link>
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
