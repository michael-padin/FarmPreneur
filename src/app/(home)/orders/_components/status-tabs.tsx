"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { OrderStatus } from "@prisma/client"
import { motion } from "motion/react"
import { useQueryState } from "nuqs"
import { useRef, useTransition } from "react"
import { searchParams } from "./searchParams"

export function StatusTabs({
	count
}: {
	count: {
		inProgressOrders: number
		pendingOrders: number
		completedOrders: number
		cancelledOrders: number
	}
}) {
	const [isLoading, startTransition] = useTransition()
	const scrollAreaRef = useRef<HTMLDivElement>(null)

	const [activeStatus, setActiveStatus] = useQueryState<OrderStatus>(
		"status",
		searchParams.status.withOptions({
			startTransition,
			shallow: false // Send updates to the server
		})
	)
	const orderStatusMap: Record<OrderStatus, { label: string; badge: number }> =
		{
			[OrderStatus.PENDING]: { label: "Pending", badge: count.pendingOrders },
			[OrderStatus.IN_PROGRESS]: {
				label: "In Progress",
				badge: count.inProgressOrders
			},
			[OrderStatus.COMPLETED]: {
				label: "Completed",
				badge: count.completedOrders
			},
			[OrderStatus.CANCELLED]: {
				label: "Cancelled",
				badge: count.cancelledOrders
			}
		}

	const statuses = Object.keys(orderStatusMap) as OrderStatus[]

	return (
		<div className="w-full pt-2">
			<div className="">
				<ScrollArea ref={scrollAreaRef} className="w-full whitespace-nowrap">
					<div className="relative flex">
						<button
							onClick={() => setActiveStatus(null)}
							className={`relative flex-1 px-4 py-2 text-center text-sm font-medium transition-colors ${activeStatus === null ? "text-primary" : "text-muted-foreground"} focus-visible:outline-none`}
						>
							All
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
								{orderStatusMap[status].label}

								<span className="ml-2 text-xs text-muted-foreground">
									{orderStatusMap[status].badge}
								</span>
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
