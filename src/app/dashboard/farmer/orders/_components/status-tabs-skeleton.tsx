"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

export default function StatusTabsSkeleton() {
	return (
		<ScrollArea className="w-full whitespace-nowrap">
			<div className="flex items-center pt-2">
				<Skeleton className="h-5 w-12 rounded-md" />
				<SkeletonTab />
				<SkeletonTab />
				<SkeletonTab />
				<SkeletonTab />
			</div>
			<ScrollBar orientation="horizontal" className="invisible" />
		</ScrollArea>
	)
}

function SkeletonTab() {
	return (
		<div className="flex w-max items-center px-4 py-2">
			<Skeleton className="h-5 w-24 rounded-md" />
			<Skeleton className="ml-2 h-5 w-5 rounded-md" />
		</div>
	)
}
