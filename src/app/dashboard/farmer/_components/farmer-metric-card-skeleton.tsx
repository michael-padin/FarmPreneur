"use client"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface FarmerMetricCardSkeletonProps {
	className?: string
}

export function FarmerMetricCardSkeleton({
	className
}: FarmerMetricCardSkeletonProps) {
	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-lg bg-card p-4",
				className
			)}
		>
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<Skeleton className="h-4 w-10 rounded" />
				</div>
				<Skeleton className="h-8 w-32 rounded" />
				<Skeleton className="h-[23.8px] w-44 rounded" />
				<Skeleton className="h-4 w-40 rounded" />
			</div>
			{/* <Skeleton
				className="absolute bottom-0 right-0 h-32 w-32 translate-x-8 translate-y-8 rounded-full border border-gray-300"
				aria-hidden="true"
			/> */}
		</div>
	)
}
