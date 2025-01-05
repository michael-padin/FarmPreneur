"use client"
import { Separator } from "@/components/ui/separator"
import { getProductBySlugUseCase } from "@/use-cases/products"
import { MessageCircle, ShoppingCart } from "lucide-react"
import Link from "next/link"

import { AddToCart } from "./add-to-cart"
import { BuyNow } from "./buy-now"

export default function ProductBottomNav({
	customerId,
	product
}: {
	customerId: string
	product: Awaited<ReturnType<typeof getProductBySlugUseCase>>
}) {
	return (
		<div className="fixed bottom-0 left-0 right-0 z-10 bg-background">
			<div className="flex h-16 w-full items-center gap-4 p-2">
				<div className="flex h-full gap-4">
					<div>
						<Link href={"/messages"}>
							<div className="flex flex-col items-center">
								<MessageCircle className="h-6 w-6 text-primary" />
								<span className="text-xs">Message</span>
							</div>
						</Link>
					</div>
					<Separator orientation="vertical" />
					<AddToCart product={product} customerId={customerId}>
						<button
							className="flex flex-col items-center rounded-none"
							type="submit"
						>
							<div className="flex flex-col items-center">
								<ShoppingCart className="h-6 w-6 text-primary" />
								<span className="text-xs">Add to Cart</span>
							</div>
						</button>
					</AddToCart>
				</div>
				<div className="flex h-full w-full flex-1 items-center">
					<BuyNow product={product} />
				</div>
			</div>
		</div>
	)
}
