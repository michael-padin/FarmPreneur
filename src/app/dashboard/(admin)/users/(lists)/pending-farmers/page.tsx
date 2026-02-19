import { DataTableSkeleton } from "@/app/dashboard/_components/data-table-skeleton"
import { FPBreadcrumbResponsive } from "@/components/fp/fp-breadcrumb"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { getPendingFarmersUseCase } from "@/use-cases/farmers"
import { Metadata } from "next"
import { Suspense } from "react"
import { DataTable } from "./_components/data-table"

export const metadata: Metadata = {
	title: "Pending Farmers"
}

//export const experimental_ppr = true

export default function UsersPage() {
	const pendingFarmersPromise = getPendingFarmersUseCase()

	const breadcrumbItems = [
		{ href: "/dashboard", label: "Dashboard" },
		{ href: "/dashboard/users", label: "Users" },
		{ label: "Farmers Waiting for Approval" }
	]

	return (
		<div className="space-y-4">
			<FPBreadcrumbResponsive items={breadcrumbItems} itemsToDisplay={3} />
			<Card className="">
				<CardHeader className="p-4 lg:p-6">
					<CardTitle>Farmers Waiting for Approval</CardTitle>
					<CardDescription>Manage pending farmers</CardDescription>
				</CardHeader>
				<CardContent className="p-4 pt-0 lg:p-6 lg:pt-0">
					<Suspense fallback={<DataTableSkeleton />}>
						<DataTable data={pendingFarmersPromise} />
					</Suspense>
				</CardContent>
			</Card>
		</div>
	)
}
