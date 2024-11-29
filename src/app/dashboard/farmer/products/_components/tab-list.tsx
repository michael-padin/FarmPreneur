"use client"

import { useEffect, useRef } from "react"
import { useQueryState } from "nuqs"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

type Status = "all" | "live" | "pending" | "rejected"

const statusData: Record<Status, { label: string; count: number }> = {
	all: { label: "All", count: 56 },
	live: { label: "Live", count: 23 },
	pending: { label: "Pending", count: 18 },
	rejected: { label: "Rejected", count: 15 }
}

export function StatusTabs() {
	const scrollAreaRef = useRef<HTMLDivElement>(null)

	const [activeStatus, setActiveStatus] = useQueryState<Status>("status", {
		defaultValue: "all",
		parse: (value): Status =>
			["all", "live", "pending", "rejected"].includes(value as Status)
				? (value as Status)
				: "all"
	})

	const statuses = Object.keys(statusData) as Status[]

	console.log("activeStatus :>> ", activeStatus)

	return (
		<div className="w-full max-w-md pt-2">
			<div className="">
				<ScrollArea ref={scrollAreaRef} className="w-full whitespace-nowrap">
					<div className="relative flex border-b">
						{statuses.map((status) => (
							<button
								key={status}
								onClick={() => setActiveStatus(status)}
								className={`relative flex-1 px-4 py-2 text-center text-sm font-medium transition-colors ${status === activeStatus ? "text-primary" : "text-muted-foreground"} focus-visible:outline-none`}
								aria-current={activeStatus === status ? "page" : undefined}
							>
								{statusData[status].label}
								<span className="ml-2 rounded-full bg-gray-100 py-0.5 text-xs text-gray-700">
									{statusData[status].count}
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
