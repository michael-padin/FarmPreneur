"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CategoryCardSkeleton({ count = 8 }: { count?: number }) {
	return (
		<>
			{new Array(count).fill(null).map((_, index) => (
				<Card className="border-none first:pl-2 last:pr-2" key={index}>
					<CardContent className="w-24 p-0">
						<div className="relative h-20 overflow-hidden rounded-lg">
							<Skeleton className="h-full w-full" />
						</div>
						<div className="px-1 pt-2">
							<Skeleton className="h-4 w-20" />
						</div>
					</CardContent>
				</Card>
			))}
		</>
	)
}
