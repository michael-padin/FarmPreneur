"use client"

import { FPMessageCircleMore } from "@/components/fp/fp-message-circle-more"
import { FPShoppingCart } from "@/components/fp/fp-shopping-cart"
import { useCart } from "@/contexts/cart-context"
import { cn } from "@/lib/utils"

export function NotificationsNavLinks() {
	const {
		cart: { distinctProductsCount }
	} = useCart()

	const containerClasses = cn("bg-transparent text-primary")
	const badgeClasses = cn("bg-primary text-white")
	return (
		<div className="flex gap-3">
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
