"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { useQuantity } from "@/contexts/quantity-context"
import { addToCart } from "@/lib/actions"
import { showErrorToast } from "@/lib/handle-error"
import { getProductBySlugUseCase } from "@/use-cases/products"
import { MessageCircle, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

export default function ProductBottomNav({
	product
}: {
	product: Awaited<ReturnType<typeof getProductBySlugUseCase>>
}) {
	const router = useRouter()
	const { addItem, cart } = useCart()
	const { quantity: inputtedQuantity } = useQuantity()
	const [state, formAction] = useActionState(addToCart, null)
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

	const handleBuyNow = () => {
		if (product.quantity === 0) {
			return toast.error("Sorry, This product is out of stock", {
				dismissible: true,
				duration: 2000,
				closeButton: true
			})
		}

		router.push(
			`/checkout?productId=${product.id}&quantity=${inputtedQuantity}`
		)
	}

	return (
		<div className="fixed bottom-0 left-0 right-0 z-10 bg-background">
			<div className="flex h-16 w-full items-center gap-4 p-2">
				<div className="flex h-full gap-4">
					<div>
						<Link href={"#"}>
							<div className="flex flex-col items-center">
								<MessageCircle className="h-6 w-6 text-primary" />
								<span className="text-xs">Message</span>
							</div>
						</Link>
					</div>
					<Separator orientation="vertical" />
					<form
						action={async () => {
							if (product.quantity === 0) {
								return toast.error("Sorry, This product is out of stock", {
									dismissible: true,
									duration: 2000,
									closeButton: true
								})
							}
							if (currentCartQuantity + inputtedQuantity > product.quantity) {
								return toast.error(
									"You can't add more than the available stock",
									{
										description: `Your have ${currentCartQuantity} in your cart and you are trying to add ${inputtedQuantity} to the cart. You can only add ${product.quantity - currentCartQuantity} more.`,
										dismissible: true,
										duration: 2000,
										closeButton: true
									}
								)
							}
							addItem(
								{
									id: product.id,
									name: product.title,
									price: product.price,
									image: product.images[0].src,
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
						<button
							className="flex flex-col items-center rounded-none"
							type="submit"
						>
							<div className="flex flex-col items-center">
								<ShoppingCart className="h-6 w-6 text-primary" />
								<span className="text-xs">Add to Cart</span>
							</div>
						</button>
					</form>
				</div>
				<div className="flex h-full w-full flex-1 items-center">
					<Button
						className="flex w-full"
						size="lg"
						type="button"
						onClick={handleBuyNow}
					>
						Buy Now
					</Button>
				</div>
			</div>
		</div>
	)
}
