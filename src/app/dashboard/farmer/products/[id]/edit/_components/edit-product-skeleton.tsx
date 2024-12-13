"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function EditProductSkeleton() {
	return (
		<div className="space-y-4 rounded-lg bg-background p-2">
			{Array.from({ length: 8 }).map((_, index) => (
				<div key={index} className="space-y-1">
					<Skeleton className="h-4 w-[100px]" />
					<Skeleton className="h-10 w-full" />
				</div>
			))}
		</div>
	)
}
