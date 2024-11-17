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
import { DashboardHeader } from "@/app/_components/header"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BreadcrumbResponsive } from "@/components/fg/back-button"
import { Plus } from "lucide-react"

const getAllProducts = async () => {
	return await getAllProductsUseCase()
}

export const metadata: Metadata = {
	title: "Products"
}
export default async function Page() {
	const products = getAllProducts()
	const breadcrumbItems = [
		{ href: "/dashboard", label: "Dashboard" },
		{ label: "Products" }
	]
	return (
		<>
			<DashboardHeader />
			<div className="space-y-4 px-4 py-5 lg:px-5">
				<BreadcrumbResponsive items={breadcrumbItems} itemsToDisplay={3} />
				<Card className="">
					<CardHeader className="p-4 lg:p-6">
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Products</CardTitle>
								<CardDescription>Manage products from farmers</CardDescription>
							</div>
							<div>
								<Button asChild className="hidden lg:block">
									<Link href={"/dashboard/products/create"}>
										Add New Product
									</Link>
								</Button>
								<Button asChild size={"icon"}>
									<Link
										href={"/dashboard/products/create"}
										className="lg:hidden"
									>
										<Plus />
									</Link>
								</Button>
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
