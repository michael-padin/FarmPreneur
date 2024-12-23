"use client"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductDetailsWrapperSkeleton() {
	return (
		<div className="pb-20 lg:container">
			<div className="hidden md:block md:py-4">
				<nav className="flex items-center space-x-2 text-sm text-muted-foreground">
					<Skeleton className="h-4 w-24" />
					<ChevronRight className="h-4 w-4" />
					<Skeleton className="h-4 w-16" />
					<ChevronRight className="h-4 w-4" />
					<Skeleton className="h-4 w-20" />
				</nav>
			</div>
			<div className="grid items-start lg:container md:grid-cols-2 lg:mx-auto lg:bg-background lg:p-4">
				<div className="grid gap-4">
					<div className="bg-background">
						<GallerySkeleton />
					</div>
				</div>
				<ProductDetailsSkeleton />
			</div>
			{/* <div className="bg-background p-4">
				<FarmerSkeleton />
			</div> */}
			<ProductBottomNavSkeleton />
		</div>
	)
}

function GallerySkeleton() {
	return (
		<div className="">
			<Skeleton className="aspect-square max-h-[550px] w-full" />
			<div className="flex flex-wrap items-center gap-2 px-3 pt-3">
				{[...Array(2)].map((_, index) => (
					<Skeleton key={index} className="h-14 w-14" />
				))}
			</div>
		</div>
	)
}

function ProductDetailsSkeleton() {
	return (
		<div className="grid bg-background p-3">
			<div className="space-y-2">
				<Skeleton className="h-8 w-32" />
				<div className="flex items-center space-x-2">
					<div className="flex">
						{[...Array(5)].map((_, i) => (
							<Skeleton key={i} className="mr-0.5 h-4 w-4" />
						))}
					</div>
					<Skeleton className="h-4 w-16" />
				</div>
			</div>
			<div className="mt-4 grid gap-4">
				<Skeleton className="full h-12 lg:h-16" />
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

import { ChevronRight } from "lucide-react"

export function LoadingSkeleton() {
	return (
		<div className="container mx-auto px-4 py-8">
			{/* Breadcrumb */}
			<nav className="mb-8 flex items-center space-x-2 text-sm text-muted-foreground">
				<Skeleton className="h-4 w-24" />
				<ChevronRight className="h-4 w-4" />
				<Skeleton className="h-4 w-16" />
				<ChevronRight className="h-4 w-4" />
				<Skeleton className="h-4 w-20" />
			</nav>

			<div className="grid gap-8 md:grid-cols-2">
				{/* Product Images */}
				<div className="space-y-4">
					<Skeleton className="aspect-square w-full rounded-lg" />
					<div className="flex gap-4">
						<Skeleton className="h-20 w-20 rounded-lg" />
						<Skeleton className="h-20 w-20 rounded-lg" />
					</div>
				</div>

				{/* Product Details */}
				<div className="space-y-6">
					<Skeleton className="h-8 w-3/4" />

					<div className="flex items-center space-x-2">
						<div className="flex">
							{[...Array(5)].map((_, i) => (
								<Skeleton key={i} className="mr-0.5 h-4 w-4" />
							))}
						</div>
						<Skeleton className="h-4 w-16" />
					</div>

					<Skeleton className="h-10 w-32 bg-emerald-50" />

					<div className="space-y-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-full" />
					</div>

					<div className="space-y-2">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-24" />
					</div>

					<div className="space-y-4">
						<div className="flex items-center space-x-4">
							<Skeleton className="h-4 w-20" />
							<div className="flex items-center space-x-2">
								<Skeleton className="h-8 w-8" />
								<Skeleton className="h-8 w-16" />
								<Skeleton className="h-8 w-8" />
							</div>
						</div>

						<div className="flex gap-4">
							<Skeleton className="h-10 w-32" />
							<Skeleton className="h-10 w-32" />
						</div>
					</div>
				</div>
			</div>

			{/* Seller Information */}
			<div className="mt-12 rounded-lg border p-6">
				<div className="flex items-center space-x-4">
					<Skeleton className="h-16 w-16 rounded-full" />
					<div className="space-y-2">
						<Skeleton className="h-5 w-32" />
						<Skeleton className="h-4 w-48" />
					</div>
				</div>
				<div className="mt-4 flex items-center justify-between">
					<div className="flex space-x-8">
						<div className="text-center">
							<Skeleton className="mx-auto h-6 w-8" />
							<Skeleton className="mt-1 h-4 w-16" />
						</div>
						<div className="text-center">
							<Skeleton className="mx-auto h-6 w-8" />
							<Skeleton className="mt-1 h-4 w-16" />
						</div>
						<div className="text-center">
							<Skeleton className="mx-auto h-6 w-8" />
							<Skeleton className="mt-1 h-4 w-16" />
						</div>
					</div>
					<Skeleton className="h-10 w-20" />
				</div>
			</div>
		</div>
	)
}
