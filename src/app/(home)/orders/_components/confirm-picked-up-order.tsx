"use client"

import { Button } from "@/components/ui/button"
import { confirmPickedUpOrder } from "@/lib/actions"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

export function ConfirmPickedUpOrder({ orderId }: { orderId: string }) {
	const [state, formAction, isPending] = useActionState(
		confirmPickedUpOrder,
		null
	)

	const formActionsWithData = formAction.bind(null, {
		orderId,
		status: "COMPLETED",
		subStatus: "BUYER_CONFIRMED_ORDER"
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
			}
		}
	}, [state])

	return (
		<form action={formActionsWithData}>
			<Button className="w-full" disabled={isPending}>
				{isPending ? "Confirming..." : "Confirm Order"}
			</Button>
		</form>
	)
}
