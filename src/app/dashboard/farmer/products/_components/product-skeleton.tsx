"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductSkeleton() {
	return (
		<div className="space-y-2">
			{[...Array(3)].map((_, index) => (
				<Card key={index} className="border-none">
					<CardHeader className="p-4 pb-2">
						<div className="flex items-start gap-4">
							<Skeleton className="h-24 w-24 rounded-lg" />
							<div className="min-w-0 flex-1 space-y-2">
								<div className="flex items-start justify-between gap-2">
									<Skeleton className="h-5 w-1/2" />
									<Skeleton className="h-4 w-16" />
								</div>
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
							</div>
						</div>
					</CardHeader>
					<CardContent className="p-4 pb-2 pt-2">
						<div className="grid grid-cols-2 gap-2">
							<div className="space-y-1">
								<Skeleton className="h-3 w-12" />
								<Skeleton className="h-4 w-20" />
							</div>
							<div className="space-y-1">
								<Skeleton className="h-3 w-12" />
								<Skeleton className="h-4 w-20" />
							</div>
						</div>
					</CardContent>
					<CardFooter className="flex items-center justify-between p-4 pt-2">
						<div className="space-y-1">
							<Skeleton className="h-3 w-24" />
							<Skeleton className="h-3 w-24" />
						</div>
						<Skeleton className="h-8 w-8 rounded-full" />
					</CardFooter>
				</Card>
			))}
		</div>
	)
}
