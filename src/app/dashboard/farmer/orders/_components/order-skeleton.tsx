"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function OrderItemSkeleton() {
	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex items-start gap-4">
					<Skeleton className="h-[100px] w-[100px] rounded-lg" />
					<div className="flex-1 space-y-2">
						<div className="flex items-start justify-between">
							<div>
								<Skeleton className="mb-1 h-5 w-32" />
								<Skeleton className="h-4 w-24" />
							</div>
							<Skeleton className="h-5 w-16" />
						</div>
						<div className="flex items-center justify-between">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-16" />
						</div>
						<div className="space-y-1">
							<Skeleton className="h-4 w-48" />
							<Skeleton className="h-4 w-40" />
						</div>
						<div className="flex gap-2 pt-2">
							<Skeleton className="h-9 w-24" />
							<Skeleton className="h-9 w-20" />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
