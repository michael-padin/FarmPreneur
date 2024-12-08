"use client"

import { updateItemQuantity } from "@/actions/cart"
import clsx from "clsx"
import { MinusIcon, PlusIcon } from "lucide-react"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

function SubmitButton({ type }: { type: "plus" | "minus" }) {
	return (
		<button
			type="submit"
			aria-label={
				type === "plus" ? "Increase item quantity" : "Reduce item quantity"
			}
			className={clsx(
				"ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80",
				{
					"ml-auto": type === "minus"
				}
			)}
		>
			{type === "plus" ? (
				<PlusIcon className="h-4 w-4" />
			) : (
				<MinusIcon className="h-4 w-4" />
			)}
		</button>
	)
}

export function EditItemQuantityButton({
	item,
	type,
	optimisticUpdate
}: {
	item: {
		farmerId: string
		id: string
		quantity: number
	}
	type: "plus" | "minus"
	optimisticUpdate?: (
		farmerId: string,
		itemId: string,
		quantity: number
	) => void
}) {
	const [message, formAction, isPending] = useActionState(
		updateItemQuantity,
		null
	)
	const payload = {
		id: item.id,
		quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1
	}
	const actionWithPayload = formAction.bind(null, payload)

	useEffect(() => {
		if (message?.error) {
			toast.error(message.error, {
				position: "top-right"
			})
		}
	}, [message])

	return (
		<form
			action={() => {
				optimisticUpdate?.(item.farmerId, item.id, payload.quantity)
				actionWithPayload()
			}}
		>
			<SubmitButton type={type} />
			<p aria-live="polite" className="sr-only" role="status">
				{message?.error}
			</p>
		</form>
	)
}
