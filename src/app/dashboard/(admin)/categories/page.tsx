import { DashboardHeader } from "@/app/_components/header"
import { FPBreadcrumbResponsive } from "@/components/fp/fp-breadcrumb"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { getCategoriesUseCase } from "@/use-cases/categories"
import { Suspense } from "react"
import { DataTableSkeleton } from "../../_components/data-table-skeleton"
import { AddCategoryDialog } from "./_components/add-category-dialog"
import { DataTable } from "./_components/data-table"

export const experimental_ppr = true

export default function CategoriesPage() {
	const categoriesPromise = getCategoriesUseCase()

	const breadcrumbItems = [
		{ href: "/dashboard", label: "Dashboard" },
		{ label: "Categories" }
	]
	return (
		<div>
			<DashboardHeader />
			<div className="space-y-4 px-4 py-5 lg:px-5">
				<FPBreadcrumbResponsive items={breadcrumbItems} itemsToDisplay={2} />
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
