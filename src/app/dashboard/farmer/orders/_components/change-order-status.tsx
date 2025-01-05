"use client"

import { Button } from "@/components/ui/button"
import { changeOrderStatus } from "@/lib/actions"
import { OrderStatus, OrderSubStatus } from "@prisma/client"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

interface ChangeOrderStatusProps {
	orderId: string
	status: OrderStatus
	subStatus: OrderSubStatus
}

export function ChangeOrderStatus({
	orderId,
	status,
	subStatus
}: ChangeOrderStatusProps) {
	const [state, formAction, isPending] = useActionState(changeOrderStatus, null)

	const formActionsWithData = formAction.bind(null, {
		orderId,
		status: "IN_PROGRESS",
		subStatus: OrderSubStatus.ORDER_ACCEPTED
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
