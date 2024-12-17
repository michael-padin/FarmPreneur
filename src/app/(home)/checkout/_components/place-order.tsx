"use client"

import { Button } from "@/components/ui/button"
import { placeOrder } from "@/lib/actions"
import { CartState } from "@/types/cart"
import { useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

export function PlaceOrder({
	checkoutData,
	validateCheckout
}: {
	checkoutData: CartState
	validateCheckout?: () => boolean
}) {
	const router = useRouter()
	const [state, formAction, isPending] = useActionState(placeOrder, null)

	const formActionsWithData = formAction.bind(null, {
		checkoutData
	})

	useEffect(() => {
		if (state) {
			if (state.error) {
				toast.error(state.error, {
					closeButton: true,
					duration: 2000,
					position: "top-right"
				})
			} else {
				toast.success("Order created successfully", {
					closeButton: true,
					duration: 2000,
					position: "top-right"
				})

				router.push("/orders")
			}
		}
	}, [state, router])

	return (
		<form
			action={() => {
				if (!validateCheckout?.()) {
					toast.error("Please add contact information", {
						closeButton: true,
						duration: 2000,
						position: "top-right"
					})
					return
				}
				formActionsWithData()
				return
			}}
		>
			<Button className="w-full" size="lg" disabled={isPending}>
				{isPending ? "Processing..." : "Place Order"}
			</Button>
		</form>
	)
}
