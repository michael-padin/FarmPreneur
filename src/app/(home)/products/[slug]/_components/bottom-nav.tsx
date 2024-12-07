"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function ProductBottomNav() {
	return (
		<div className="fixed bottom-0 left-0 right-0 bg-background">
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
					<div>
						<button
							className="flex flex-col items-center rounded-none"
							onClick={() => console.log("Add to cart clicked")}
						>
							<div className="flex flex-col items-center">
								<ShoppingCart className="h-6 w-6 text-primary" />
								<span className="text-xs">Add to Cart</span>
							</div>
						</button>
					</div>
				</div>
				<div className="w-full flex-1">
					<Button
						className="h-full w-full rounded-none bg-primary text-primary-foreground"
						onClick={() => console.log("Buy now clicked")}
					>
						Buy Now
					</Button>
				</div>
			</div>
		</div>
	)
}
