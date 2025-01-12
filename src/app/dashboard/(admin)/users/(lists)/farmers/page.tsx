import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { getFarmersUseCase } from "@/use-cases/farmers"

import { DataTableSkeleton } from "@/app/dashboard/_components/data-table-skeleton"
import { FPBreadcrumbResponsive } from "@/components/fp/fp-breadcrumb"
import { Metadata } from "next"
import { Suspense } from "react"
import { DataTable } from "./_components/data-table"

export const metadata: Metadata = {
	title: "Farmers"
}
export const experimental_ppr = true

export default function FarmersPage() {
	const farmerListPromise = getFarmersUseCase()
	const breadcrumbItems = [
		{ href: "/dashboard", label: "Dashboard" },
		{ href: "/dashboard/users", label: "Users" },
		{ label: "Farmers" }
	]
	return (
		<div className="space-y-4">
			<FPBreadcrumbResponsive items={breadcrumbItems} itemsToDisplay={3} />
			<Card className="">
				<CardHeader className="p-4 lg:p-6">
					<CardTitle>Farmers</CardTitle>
					<CardDescription>Manage farmers account</CardDescription>
				</CardHeader>
				<CardContent>
					<Suspense fallback={<DataTableSkeleton />}>
						<DataTable data={farmerListPromise} />
					</Suspense>
				</CardContent>
			</Card>
		</div>
	)
}
