"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronRight } from "lucide-react"

export default function CartCheckOutListSkeleton() {
	return (
		<>
			<ScrollArea className="flex-1 p-2">
				<div className="space-y-4 lg:container">
					{[1, 2].map((group) => (
						<Card key={group} className="border-none bg-background">
							<CardContent className="w-full space-y-2 p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Skeleton className="h-6 w-40" />
										<ChevronRight className="h-4 w-4" />
									</div>
								</div>

								<div className="w-full space-y-4">
									{[1, 2].map((item) => (
										<div key={item}>
											<div className="mb-2 flex items-center justify-between text-sm">
												<div className="w-full">
													<div className="flex justify-between">
														<Skeleton className="h-4 w-28" />
														<Skeleton className="h-4 w-8" />
													</div>
													<Skeleton className="mt-1 h-4 w-full" />
												</div>
											</div>
											<div className="space-y-4">
												<div className="flex gap-4">
													<Skeleton className="h-24 w-24 rounded-lg" />
													<div className="flex flex-1 flex-col gap-1">
														<div className="flex items-center justify-between">
															<Skeleton className="h-5 w-32" />
														</div>
														<div className="mt-auto flex items-center justify-between">
															<Skeleton className="h-4 w-20" />
															<Skeleton className="h-4 w-8" />
														</div>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</ScrollArea>

			<div className="sticky bottom-0 border-t bg-background">
				<div className="grid grid-cols-2 p-2 lg:container">
					<div className="flex items-center justify-center">
						<div className="text-lg">
							<Skeleton className="h-6 w-32" />
						</div>
					</div>
					<Skeleton className="h-10 w-full" />
				</div>
			</div>
		</>
	)
}
