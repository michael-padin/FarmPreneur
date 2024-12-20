"use client"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductDetailsWrapperSkeleton() {
	return (
		<div className="space-y-4 pb-20 lg:container">
			<div className="grid items-start lg:container md:grid-cols-2 lg:mx-auto lg:px-4">
				<div className="grid gap-4">
					<div className="bg-background">
						<GallerySkeleton />
					</div>
				</div>
				<ProductDetailsSkeleton />
			</div>
			<div className="bg-background p-4">
				<FarmerSkeleton />
			</div>
			<ProductBottomNavSkeleton />
		</div>
	)
}

function GallerySkeleton() {
	return (
		<div>
			<Skeleton className="aspect-square max-h-[550px] w-full" />
			<div className="flex flex-wrap items-center gap-2 px-3 pt-3">
				{[...Array(4)].map((_, index) => (
					<Skeleton key={index} className="h-14 w-14" />
				))}
			</div>
		</div>
	)
}

function ProductDetailsSkeleton() {
	return (
		<div className="grid bg-background p-3">
			<div className="flex items-center justify-between gap-4">
				<Skeleton className="h-8 w-32" />
				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-16" />
					<Skeleton className="h-4 w-16" />
				</div>
			</div>
			<div className="mt-4 grid gap-4">
				<Skeleton className="h-8 w-3/4" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-3/4" />
			</div>
		</div>
	)
}

function FarmerSkeleton() {
	return (
		<div>
			<Skeleton className="mb-2 h-6 w-48" />
			<Skeleton className="h-4 w-32" />
		</div>
	)
}

function ProductBottomNavSkeleton() {
	return (
		<div className="fixed bottom-0 left-0 right-0 z-10 bg-background">
			<div className="flex h-16 w-full items-center gap-4 p-2">
				<div className="flex h-full gap-4">
					<Skeleton className="h-12 w-12" />
					<Skeleton className="h-12 w-12" />
				</div>
				<Skeleton className="h-12 flex-1" />
			</div>
		</div>
	)
}
