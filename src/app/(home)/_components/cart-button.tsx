import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

export default function CartButton({ itemCount = 0 }: { itemCount?: number }) {
	return (
		<Button
			variant="ghost"
			size="icon"
			className="relative hover:bg-transparent hover:text-white"
		>
			<ShoppingCart />
			{itemCount > 0 && (
				<span className="absolute -right-1 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[0.6rem] text-primary">
					{itemCount}
				</span>
			)}
			<span className="sr-only">Shopping cart</span>
		</Button>
	)
}
