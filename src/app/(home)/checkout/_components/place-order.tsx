"use client"

import { Button } from "@/components/ui/button"
import { CartState } from "@/types/cart"

export function PlaceOrder({ cart }: { cart: CartState }) {
	const isPending = false
	return (
		<form action={() => {}}>
			<Button className="w-full" size="lg">
				{isPending ? "Processing..." : "Place Order"}
			</Button>
		</form>
	)
}
