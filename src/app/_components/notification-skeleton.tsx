"use client"
import { Skeleton } from "@/components/ui/skeleton"

export function NotificationSkeleton() {
	return (
		<>
			{Array.from({ length: 6 }).map((_, index) => (
				<div className="flex w-full max-w-sm items-start gap-3 p-4" key={index}>
					{/* Icon skeleton */}
					<Skeleton className="h-8 w-8 rounded-md" />
					<div className="flex-1 space-y-2">
						{/* Header skeleton */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Skeleton className="h-5 w-40" />
								<Skeleton className="h-2 w-2 rounded-full" />
							</div>
							{/* <X className="h-4 w-4 text-muted-foreground" /> */}
						</div>
						{/* Content skeleton */}
						<div className="space-y-1">
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-4 w-1/4" />
						</div>
						{/* Timestamp skeleton */}
						<Skeleton className="h-3 w-24" />
					</div>
				</div>
			))}
		</>
	)
}
