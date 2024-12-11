"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface ProductCardSkeletonProps {
	className?: string
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
	return (
		<Card className={cn("overflow-hidden", className)}>
			<CardContent className="p-0">
				<div className="relative aspect-square overflow-hidden">
					<Skeleton className="aspect-square h-full w-full bg-background" />
				</div>
				<div className="p-2">
					<Skeleton className="h-4 w-full" />
					<div className="mt-2 flex items-center gap-2">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-px" />
						<Skeleton className="h-4 w-24" />
					</div>
					<div className="mt-2 flex items-center justify-between">
						<Skeleton className="h-5 w-20" />
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
