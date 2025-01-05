"use client"
import { getProductBySlugUseCase } from "@/use-cases/products"
import { MessageCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { AddToCart } from "./add-to-cart"
import { BuyNow } from "./buy-now"

export default function ProductBottomNav({
	customerId,
	product,
	userId
}: {
	customerId: string
	userId: string
	product: Awaited<ReturnType<typeof getProductBySlugUseCase>>
}) {
	return (
		<div className="fixed bottom-0 left-0 right-0 z-10 bg-background drop-shadow-2xl">
			<div className="flex w-full items-center gap-3 px-3 py-4">
				<div className="flex h-full">
					<Button variant="outline" size={"icon"}>
						<Link href={`/messages/${userId}`}>
							<MessageCircle className="" />
							<span className="sr-only">Send Message</span>
						</Link>
					</Button>
				</div>
				<AddToCart product={product} customerId={customerId}>
					<Button variant="outline" type="submit">
						{/* <ShoppingCart className="text-primary" /> */}
						<span className="">Add to Cart</span>
					</Button>
				</AddToCart>
				<div className="flex h-full w-full flex-1 items-center">
					<BuyNow product={product} />
				</div>
			</div>
		</div>
	)
}
