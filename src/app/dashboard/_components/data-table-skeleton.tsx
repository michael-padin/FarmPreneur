"use client"

import { Skeleton } from "@/components/ui/skeleton"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"

interface DataTableSkeletonProps {
	columns?: number
	rows?: number
}

export function DataTableSkeleton({
	columns = 8,
	rows = 5
}: DataTableSkeletonProps) {
	return (
		<div className="space-y-4">
			<div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-x-2 sm:space-y-0">
				<Skeleton className="h-8 w-full max-w-sm lg:w-[150px]" />
				<div className="flex space-x-2">
					<Skeleton className="h-8 w-full lg:w-[70px]" />
					<Skeleton className="h-8 w-full lg:w-[70px]" />
					<Skeleton className="h-8 w-full lg:w-[70px]" />
				</div>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							{[...Array(columns)].map((_, index) => (
								<TableHead key={index}>
									<Skeleton className="h-6 w-full" />
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{[...Array(rows)].map((_, rowIndex) => (
							<TableRow key={rowIndex}>
								{[...Array(columns)].map((_, cellIndex) => (
									<TableCell key={cellIndex}>
										<Skeleton className="h-6 w-[70px]" />
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-between">
				<Skeleton className="h-8 w-[100px]" />
				<div className="flex items-center space-x-2 lg:space-x-8">
					<Skeleton className="h-8 w-8" />
					<Skeleton className="h-8 w-8" />
					<Skeleton className="h-8 w-8" />
				</div>
			</div>
		</div>
	)
}
