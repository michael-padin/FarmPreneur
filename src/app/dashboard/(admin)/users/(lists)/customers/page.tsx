import { auth } from "@/auth"
import { redirect } from "next/navigation"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { DataTable } from "./_components/data-table"
import { Suspense } from "react"
import { DataTableSkeleton } from "@/app/dashboard/_components/data-table-skeleton"
import { Metadata } from "next"
import { getCustomersUseCase } from "@/use-cases/users"

export const metadata: Metadata = {
	title: "Customers"
}

export const experimental_ppr = true

export default function CustomersPage() {
	const customersPromise = getCustomersUseCase()

	return (
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
	)
}
