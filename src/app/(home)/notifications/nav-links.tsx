"use client"

import { FPShoppingCart } from "@/components/fp/fp-shopping-cart"
import { useCart } from "@/contexts/cart-context"
import { cn } from "@/lib/utils"

export function NotificationsNavLinks() {
	const {
		cart: { distinctProductsCount }
	} = useCart()
	const countMessages = 10

	const navButtonClasses = cn(
		"flex items-center justify-center rounded-full p-1.5",
		"bg-transparent text-primary"
	)

	const containerClasses = cn("bg-transparent text-primary")
	const badgeClasses = cn("bg-primary text-white")
	return (
		<FPShoppingCart
			badgeClassName={badgeClasses}
			containerClassName={containerClasses}
		/>
	)
}
