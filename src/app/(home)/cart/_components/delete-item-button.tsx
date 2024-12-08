"use client"

import { removeFromCart } from "@/actions/cart"
import { Trash2 } from "lucide-react"
import { useActionState } from "react"

export function DeleteItemButton({
	cartId,
	optimisticUpdate
}: {
	cartId: string
	optimisticUpdate: any
}) {
	const [message, formAction] = useActionState(removeFromCart, null)
	const actionWithCartId = formAction.bind(null, cartId)

	return (
		<form
			action={() => {
				optimisticUpdate()
				actionWithCartId()
			}}
		>
			<button className="flex items-center gap-2 text-destructive">
				<Trash2 className="h-4 w-4" />
				<span className="sr-only">Remove</span>
			</button>
		</form>
	)
}
