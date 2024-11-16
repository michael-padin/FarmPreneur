import { Header } from "@/app/_components/header"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Suspense } from "react"
import { DataTableSkeleton } from "../../_components/data-table-skeleton"
import { AddCategoryDialog } from "./_components/add-category-dialog"
import { getCategoriesUseCase } from "@/use-cases/categories"
import { DataTable } from "./_components/data-table"
import { BreadcrumbResponsive } from "@/components/fg/back-button"

async function getCategories() {
	return await getCategoriesUseCase()
}

export default async function CategoriesPage() {
	const categoriesPromise = getCategories()

	const breadcrumbItems = [
		{ href: "/dashboard", label: "Dashboard" },
		{ label: "Categories" }
	]
	return (
		<div>
			<Header />
			<div className="space-y-2 p-2 lg:space-y-4 lg:p-5">
				<BreadcrumbResponsive items={breadcrumbItems} />
				<Card className="">
					<CardHeader className="p-4 lg:p-6">
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Categories</CardTitle>
								<CardDescription>Manage your categories</CardDescription>
							</div>
							<div>
								<AddCategoryDialog />
							</div>
						</div>
					</CardHeader>
					<CardContent className="p-4 pt-0 lg:p-6 lg:pt-0">
						<Suspense fallback={<DataTableSkeleton />}>
							<DataTable data={categoriesPromise} />
						</Suspense>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
