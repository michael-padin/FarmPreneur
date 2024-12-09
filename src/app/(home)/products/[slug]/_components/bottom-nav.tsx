"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { useQuantity } from "@/contexts/quantity-context"
import { addToCart } from "@/lib/actions"
import { getProductBySlugUseCase } from "@/use-cases/products"
import { MessageCircle, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

export default function ProductBottomNav({
	product
}: {
	product: Awaited<ReturnType<typeof getProductBySlugUseCase>>
}) {
	const { addItem } = useCart()
	const { quantity } = useQuantity()
	const [state, formAction] = useActionState(addToCart, null)
	const actionWithProductId = formAction.bind(null, {
		productId: product.id,
		quantity
	})

	// Show toast when state changes
	useEffect(() => {
		if (state) {
			if (state.error) {
				toast.error("Error", {
					description: state.error || "Failed to add item to cart"
				})
			}
		}
	}, [state])

	return (
		<div className="fixed bottom-0 left-0 right-0 z-10 bg-background">
			<div className="flex h-full w-full">
				<div className="flex h-14 gap-4 p-2 px-4">
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
							addItem(
								{
									id: product.id,
									name: product.title,
									price: product.price,
									image: product.images[0].src,
									unit: product.unit,
									pickupLocation: product.pickupLocation!,
									farmer: product.farmer
								},
								quantity
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
				<div className="w-full flex-1">
					<Button className="h-full w-full rounded-none bg-primary text-primary-foreground">
						Buy Now
					</Button>
				</div>
			</div>
		</div>
	)
}
