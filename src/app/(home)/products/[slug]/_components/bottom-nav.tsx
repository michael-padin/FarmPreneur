import { Button } from "@/components/ui/button"
import { MessageCircle, ShoppingCart } from "lucide-react"

export default function ProductBottomNav() {
	return (
		<div className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700">
			<div className="mx-auto grid h-16 max-w-lg grid-cols-4">
				<Button variant="secondary" className="grid h-full" size={"lg"}>
					<MessageCircle />
					<p className="">Message</p>
				</Button>
				<Button variant="secondary" className="block" size={"lg"}>
					<ShoppingCart className="size-20" />
					<span className="text-xs">Cart</span>
				</Button>
				<Button className="col-span-2 h-full rounded-none">Buy Now</Button>
			</div>
		</div>
	)
}
