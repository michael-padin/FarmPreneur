"use client"

import { FPMessageCircleMore } from "@/components/fp/fp-message-circle-more"
import { FPShoppingCart } from "@/components/fp/fp-shopping-cart"

export function ProductListNavLinks() {
	return (
		<div className="flex gap-3">
			<FPShoppingCart
				badgeClassName="bg-primary text-white"
				containerClassName="text-primary"
			/>
			<FPMessageCircleMore containerClassName="text-primary" />
		</div>
	)
}
