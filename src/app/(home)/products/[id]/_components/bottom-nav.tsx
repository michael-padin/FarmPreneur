import { MessageCircle, ShoppingCart, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProductBottomNav() {
	return (
		<div className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700">
			<div className="mx-auto grid h-16 max-w-lg grid-cols-4">
				<Button
					variant="secondary"
					className="flex h-full flex-col items-center justify-center gap-2"
				>
					<MessageCircle />
					<span className="">Message</span>
				</Button>
				<Button
					variant="secondary"
					className="flex h-full flex-col items-center justify-center gap-2"
				>
					<ShoppingCart />
					<span className="">Cart</span>
				</Button>
				<Button className="col-span-2 h-full rounded-none">Buy Now</Button>
			</div>
		</div>
	)
}
