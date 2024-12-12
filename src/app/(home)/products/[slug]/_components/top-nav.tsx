"use client"

import { FPBackButton } from "@/components/fp/fp-back-button"
import { FPMessageCircleMore } from "@/components/fp/fp-message-circle-more"
import { FPSearchSheet } from "@/components/fp/fp-search-sheet"
import { FPShoppingCart } from "@/components/fp/fp-shopping-cart"
import { useScrollDetection } from "@/hooks/use-scroll-detection"
import { cn } from "@/lib/utils"

export function TopNav() {
	const scrolled = useScrollDetection({ threshold: 60 })

	const containerClasses = cn(
		scrolled ? "bg-transparent text-primary" : "bg-black/40 text-white"
	)

	const badgeClasses = cn("bg-primary text-primary-foreground")

	return (
		<div
			className={cn(
				"fixed left-0 right-0 top-0 z-10",
				scrolled ? "bg-white shadow-md" : "bg-transparent"
			)}
		>
			<div className="flex items-center justify-between p-3 px-1.5">
				<FPBackButton className={containerClasses} />
				<div className="flex gap-2">
					<FPSearchSheet triggerClassName={`${containerClasses}`} />
					<FPShoppingCart
						containerClassName={containerClasses}
						badgeClassName={badgeClasses}
					/>
					<FPMessageCircleMore
						containerClassName={containerClasses}
						className={badgeClasses}
					/>
				</div>
			</div>
		</div>
	)
}
