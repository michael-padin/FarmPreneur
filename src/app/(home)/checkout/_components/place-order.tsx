"use client"

import { Button } from "@/components/ui/button"
import { placeOrder } from "@/lib/actions"
import { CartState } from "@/types/cart"
import { useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

export function PlaceOrder({ checkoutData }: { checkoutData: CartState }) {
	const router = useRouter()
	const [state, formAction, isPending] = useActionState(placeOrder, null)

	const actions = formAction.bind(null, {
		checkoutData
	})

	useEffect(() => {
		if (state) {
			if (state.error) {
				toast.error("Error", {
					description: state.error || "Failed to create order"
				})
			} else {
				toast.success("Success", {
					description: "Order created successfully"
				})

				router.push("/orders")
			}
		}
	}, [state, router])

	return (
		<form action={actions}>
			<Button className="w-full" size="lg" disabled={isPending}>
				{isPending ? "Processing..." : "Place Order"}
			</Button>
		</form>
	)
}
