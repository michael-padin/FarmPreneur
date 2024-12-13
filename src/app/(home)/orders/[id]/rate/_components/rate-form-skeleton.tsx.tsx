import { Skeleton } from "@/components/ui/skeleton"

export default function ReviewFormSkeleton() {
	return (
		<div>
			<div className="relative w-full">
				<div className="space-y-2">
					{[1, 2, 3].map((item) => (
						<div key={item} className="space-y-4 rounded-lg bg-background p-2">
							<div className="flex gap-4">
								<Skeleton className="h-24 w-24 rounded-lg" />
								<div className="flex flex-1 flex-col gap-1">
									<div className="flex items-center justify-between">
										<Skeleton className="h-6 w-24" />
									</div>
									<div className="mt-auto flex items-center justify-between">
										<Skeleton className="h-4 w-20" />
										<Skeleton className="h-4 w-8" />
									</div>
								</div>
							</div>
							<div className="space-y-2">
								<Skeleton className="h-4 w-24" />
								<div className="my-2 flex items-center space-x-2">
									{[1, 2, 3, 4, 5].map((star) => (
										<Skeleton key={star} className="h-6 w-6 rounded-full" />
									))}
								</div>
								<Skeleton className="h-4 w-40" />
							</div>
							<div className="space-y-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-20 w-full" />
							</div>
						</div>
					))}

					<div className="fixed bottom-0 left-0 right-0 flex bg-background p-4">
						<Skeleton className="h-10 w-full" />
					</div>
				</div>
			</div>
		</div>
	)
}
