"use client"

import { Button } from "@/components/ui/button"
import { changeOrderStatus } from "@/lib/actions"
import { OrderStatus, OrderSubStatus } from "@prisma/client"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

export function PrepareOrder({ orderId }: { orderId: string }) {
	const [state, formAction, isPending] = useActionState(changeOrderStatus, null)

	const formActionsWithData = formAction.bind(null, {
		orderId,
		status: OrderStatus.IN_PROGRESS,
		subStats: OrderSubStatus.PREPARING_PRODUCE
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
				// toast.success("Order created successfully", {
				// 	closeButton: true,
				// 	duration: 2000,
				// 	position: "top-right"
				// })
			}
		}
	}, [state])

	return (
		<form action={formActionsWithData}>
			<Button className="w-full" disabled={isPending}>
				{isPending ? "Accepting..." : "Accept Order"}
			</Button>
		</form>
	)
}
