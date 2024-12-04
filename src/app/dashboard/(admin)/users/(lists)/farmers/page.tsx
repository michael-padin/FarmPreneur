import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { getFarmersUseCase } from "@/use-cases/farmers"

import { Suspense } from "react"
import { DataTableSkeleton } from "@/app/dashboard/_components/data-table-skeleton"
import { DataTable } from "./_components/data-table"
import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Farmers"
}
export const experimental_ppr = true

export default function UsersPage() {
	const farmerListPromise = getFarmersUseCase()

	return (
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
	)
}
