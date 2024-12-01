"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function CreateProductSkeleton() {
	return (
		<div className="space-y-4">
			{Array.from({ length: 6 }).map((_, index) => (
				<div key={index} className="space-y-1">
					<Skeleton className="h-4 w-[100px]" />
					<Skeleton className="h-10 w-full" />
				</div>
			))}
		</div>
	)
}
