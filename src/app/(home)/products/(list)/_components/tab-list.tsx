"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { motion } from "motion/react"
import { useQueryState } from "nuqs"
import { useRef, useTransition } from "react"
import { ProductSort, searchParams } from "../searchParams"

const ProductSortMap: Record<ProductSort, { label: string }> = {
	[ProductSort.relevance]: { label: "Relevance" },
	[ProductSort.latest]: { label: "Latest" },
	[ProductSort.priceLowToHigh]: { label: "Price: Low to High" },
	[ProductSort.priceHighToLow]: { label: "Price: High to Low" }
}

export function ProductStatusTabs() {}

export function SortTabs() {
	const [isLoading, startTransition] = useTransition()
	const scrollAreaRef = useRef<HTMLDivElement>(null)

	const [sortBy, setSortBy] = useQueryState(
		"sortBy",
		searchParams.sortBy.withOptions({
			startTransition,
			shallow: false // Send updates to the server
		})
	)

	const sorts = Object.keys(ProductSortMap) as ProductSort[]

	return (
		<div className="w-full">
			<div className="">
				<ScrollArea ref={scrollAreaRef} className="w-full whitespace-nowrap">
					<div className="relative flex">
						{sorts.map((sort) => (
							<button
								key={sort}
								onClick={() => setSortBy(sort)}
								className={`relative flex-1 px-3 pb-3 text-center text-sm font-medium transition-colors ${sort === sortBy ? "text-primary" : "text-muted-foreground"} focus-visible:outline-none`}
								aria-current={sortBy === sort ? "page" : undefined}
							>
								<div className="relative">{ProductSortMap[sort].label}</div>
								{sort === sortBy && (
									<motion.div
										className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
										layoutId="activeTab"
										transition={{
											type: "spring",
											bounce: 0.2,
											duration: 0.6
										}}
									/>
								)}
							</button>
						))}
					</div>
					<ScrollBar orientation="horizontal" className="invisible" />
				</ScrollArea>
			</div>
		</div>
	)
}
