import { DashboardHeader } from "@/app/_components/header"
import { DataTableSkeleton } from "@/app/dashboard/_components/data-table-skeleton"
import { FPBreadcrumbResponsive } from "@/components/fp/fp-breadcrumb"
import { Button, buttonVariants } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { getAllProductsUseCase } from "@/use-cases/products"
import { Plus } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { DataTable } from "./_components/data-table"

export const experimental_ppr = true

export const metadata: Metadata = {
	title: "Products"
}
export default function Page() {
	const products = getAllProductsUseCase()
	const breadcrumbItems = [
		{ href: "/dashboard", label: "Dashboard" },
		{ label: "Products" }
	]
	return (
		<>
			<DashboardHeader />
			<div className="space-y-4 px-4 py-5 lg:px-5">
				<FPBreadcrumbResponsive items={breadcrumbItems} itemsToDisplay={2} />
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
									className={cn(
										buttonVariants({ variant: "default" }),
										"hidden lg:inline-flex"
									)}
								>
									Add New Product
								</Link>
								<Button asChild size={"icon"} className="lg:hidden">
									<Link href={"/dashboard/products/create"}>
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
