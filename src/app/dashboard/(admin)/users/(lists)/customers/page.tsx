import { DataTableSkeleton } from "@/app/dashboard/_components/data-table-skeleton"
import { FPBreadcrumbResponsive } from "@/components/fp/fp-breadcrumb"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { getCustomersUseCase } from "@/use-cases/users"
import { Metadata } from "next"
import { Suspense } from "react"
import { DataTable } from "./_components/data-table"

export const metadata: Metadata = {
	title: "Customers"
}

//export const experimental_ppr = true

export default function CustomersPage() {
	const customersPromise = getCustomersUseCase()
	const breadcrumbItems = [
		{ href: "/dashboard", label: "Dashboard" },
		{ href: "/dashboard/users", label: "Users" },
		{ label: "Customers" }
	]
	return (
		<div className="space-y-4">
			<FPBreadcrumbResponsive items={breadcrumbItems} itemsToDisplay={3} />
			<Card className="">
				<CardHeader className="p-4 lg:p-6">
					<CardTitle>Customers</CardTitle>
					<CardDescription>Manage customers account</CardDescription>
				</CardHeader>
				<CardContent className="p-4 pt-0 lg:p-6 lg:pt-0">
					<Suspense fallback={<DataTableSkeleton />}>
						<DataTable data={customersPromise} />
					</Suspense>
				</CardContent>
			</Card>
		</div>
	)
}
