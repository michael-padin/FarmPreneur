"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function EditUserSkeleton() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="h-10 w-[200px]" />
				<Skeleton className="h-4 w-[300px]" />
			</CardHeader>
			<CardContent className="space-y-6">
				{Array.from({ length: 6 }).map((_, index) => (
					<div key={index} className="space-y-1">
						<Skeleton className="h-4 w-[100px]" />
						<Skeleton className="h-10 w-full" />
					</div>
				))}
			</CardContent>
			<CardFooter className="flex justify-between">
				<Skeleton className="" />
				<Skeleton className="" />
			</CardFooter>
		</Card>
	)
}
