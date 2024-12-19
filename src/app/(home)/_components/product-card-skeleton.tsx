"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductCardSkeletonProps {
	className?: string
	count?: number
}

export function ProductCardSkeleton({
	className,
	count
}: ProductCardSkeletonProps) {
	return (
		<>
			{new Array(count).fill(null).map((_, index) => (
				<Card className="overflow-hidden" key={index}>
					<CardContent className="group p-0">
						<div className="relative aspect-square overflow-hidden">
							<Skeleton className="h-full w-full" />
						</div>
						<div className="overflow-hidden p-2 lg:p-4">
							<div className="flex justify-between gap-1">
								<Skeleton className="h-4 w-3/4 lg:h-5" />
							</div>
							<div className="mt-2 flex items-center justify-between">
								<Skeleton className="h-4 w-1/4 lg:h-5" />
								<div className="flex items-center gap-1">
									<Skeleton className="h-3 w-8 lg:h-4 lg:w-12" />
									<Separator orientation="vertical" className="h-3 w-px" />
									<Skeleton className="h-3 w-12 lg:h-4 lg:w-16" />
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</>
	)
}
