import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function AddressSkeleton({ count = 3 }: { count?: number }) {
	return (
		<>
			{new Array(count).fill(null).map((_, index) => (
				<Card className="border-none outline-none" key={index}>
					<CardContent className="flex items-start p-4">
						<Skeleton className="h-4 w-4 rounded-full" />
						<div className="ml-4 flex-grow space-y-2">
							<Skeleton className="h-5 w-1/4" />
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-4 w-1/2" />
							<Skeleton className="h-4 w-1/3" />
						</div>
						<Skeleton className="h-8 w-8 rounded-full" />
					</CardContent>
				</Card>
			))}
		</>
	)
}
