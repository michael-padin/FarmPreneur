"use client"

import { removeFromCart } from "@/lib/actions"
import { Trash2 } from "lucide-react"
import { useActionState } from "react"

export function DeleteItemButton({
	itemId,
	removeItem
}: {
	itemId: string
	removeItem: (itemId: string) => void
}) {
	const [message, formAction] = useActionState(removeFromCart, null)
	const actionWithCartId = formAction.bind(null, itemId)

	return (
		<form
			action={async () => {
				removeItem(itemId)
				await actionWithCartId()
			}}
		>
			<button className="flex items-center gap-2 text-destructive">
				<Trash2 className="h-4 w-4" />
				<span className="sr-only">Remove</span>
			</button>
		</form>
	)
}
