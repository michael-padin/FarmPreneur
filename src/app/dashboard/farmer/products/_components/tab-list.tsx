"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ProductListingStatus } from "@prisma/client"
import { motion } from "motion/react"
import { useQueryState } from "nuqs"
import { useRef, useTransition } from "react"
import { searchParams } from "./searchParams"

const productListingStatusMap: Record<ProductListingStatus, { label: string }> =
	{
		[ProductListingStatus.PENDING]: { label: "Pending" },
		[ProductListingStatus.APPROVED]: { label: "Approved" },
		[ProductListingStatus.REJECTED]: { label: "Rejected" },
		[ProductListingStatus.OUT_OF_STOCK]: { label: "Out of Stock" },
		[ProductListingStatus.EXPIRED]: { label: "Expired" },
		[ProductListingStatus.PAUSED]: { label: "Paused" }
	}
export function StatusTabs() {
	const [isLoading, startTransition] = useTransition()
	const scrollAreaRef = useRef<HTMLDivElement>(null)

	const [activeStatus, setActiveStatus] = useQueryState<ProductListingStatus>(
		"status",
		searchParams.status.withOptions({
			startTransition,
			shallow: false // Send updates to the server
		})
	)

	const statuses = Object.keys(
		productListingStatusMap
	) as ProductListingStatus[]

	return (
		<div className="w-full">
			<div className="">
				<ScrollArea ref={scrollAreaRef} className="w-full whitespace-nowrap">
					<div className="relative flex">
						<button
							onClick={() => setActiveStatus(null)}
							className={`relative flex-1 px-4 py-2 text-center text-sm font-medium transition-colors ${activeStatus === null ? "text-primary" : "text-muted-foreground"} focus-visible:outline-none`}
						>
							All
							{/* <span className="ml-2 rounded-full bg-gray-100 py-0.5 text-xs text-gray-700">
									{statusData[status].count}
								</span> */}
							{activeStatus === null && (
								<motion.div
									className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
									layoutId="activeTab"
									transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
								/>
							)}
						</button>
						{statuses.map((status) => (
							<button
								key={status}
								onClick={() => setActiveStatus(status)}
								className={`relative flex-1 px-4 py-2 text-center text-sm font-medium transition-colors ${status === activeStatus ? "text-primary" : "text-muted-foreground"} focus-visible:outline-none`}
								aria-current={activeStatus === status ? "page" : undefined}
							>
								{productListingStatusMap[status].label}
								{/* <span className="ml-2 rounded-full bg-gray-100 py-0.5 text-xs text-gray-700">
									{statusData[status].count}
								</span> */}
								{activeStatus === status && (
									<motion.div
										className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
										layoutId="activeTab"
										transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
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
