"use client"
import { useCart } from "@/contexts/cart-context"
import { useQuantity } from "@/contexts/quantity-context"
import { addToCart } from "@/lib/actions"
import { showErrorToast } from "@/lib/handle-error"
import { getProductBySlugUseCase } from "@/use-cases/products"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

export function AddToCart({
	product,
	children
}: {
	product: Awaited<ReturnType<typeof getProductBySlugUseCase>>
	children: React.ReactNode
}) {
	const { addItem, cart } = useCart()
	const [state, formAction] = useActionState(addToCart, null)
	const { quantity: inputtedQuantity } = useQuantity()

	const actionWithProductId = formAction.bind(null, {
		productId: product.id,
		quantity: inputtedQuantity
	})
	const currentCartQuantity =
		cart.items.find((item) => item.product.id === product.id)?.quantity || 0

	useEffect(() => {
		if (state) {
			if (state.error) {
				showErrorToast(state.error)
			}
		}
	}, [state])

	return (
		<form
			action={async () => {
				if (product.quantity === 0) {
					toast.error("Sorry, This product is out of stock", {
						dismissible: true,
						duration: 2000,
						closeButton: true
					})
					return
				}
				if (currentCartQuantity + inputtedQuantity > product.quantity) {
					toast.error("You can't add more than the available stock", {
						description: `Your have ${currentCartQuantity} in your cart and you are trying to add ${inputtedQuantity} to the cart. You can only add ${product.quantity - currentCartQuantity} more.`,
						dismissible: true,
						duration: 2000,
						closeButton: true
					})
					return
				}
				addItem(
					{
						id: product.id,
						name: product.title,
						price: product.price,
						image: product.productImages[0] || "/placeholder.svg",
						unit: product.unit,
						farmer: {
							addresses: product.farmer!.addresses,
							id: product.farmer!.id,
							name: product.farmer.name || "",
							contactNumber: product.farmer!.contactNumber || ""
						}
					},
					inputtedQuantity
				)
				actionWithProductId()
			}}
		>
			{children}
		</form>
	)
}
