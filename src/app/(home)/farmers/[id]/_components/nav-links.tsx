"use client"

import { FPMessageCircleMore } from "@/components/fp/fp-message-circle-more"
import { FPSearchSheet } from "@/components/fp/fp-search-sheet"
import { FPShoppingCart } from "@/components/fp/fp-shopping-cart"
import { useCart } from "@/contexts/cart-context"
import { cn } from "@/lib/utils"

export function FarmerPageNavLinks() {
	const {
		cart: { distinctProductsCount }
	} = useCart()
	const containerClasses = cn("bg-transparent text-primary")
	const badgeClasses = cn("bg-primary text-white")
	return (
		<div className="flex gap-3">
			<FPSearchSheet triggerClassName={containerClasses} />
			<FPShoppingCart
				badgeClassName={badgeClasses}
				containerClassName={containerClasses}
			/>
			<FPMessageCircleMore
				className={badgeClasses}
				containerClassName={containerClasses}
			/>
		</div>
	)
}
