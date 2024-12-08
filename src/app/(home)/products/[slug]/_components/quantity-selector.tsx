"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useQuantity } from "@/contexts/quantity-context"
import { MinusIcon, PlusIcon } from "lucide-react"

export function QuantitySelector() {
	const { quantity, setQuantity, stock } = useQuantity()

	const increaseQuantity = () => {
		setQuantity((prev) => Math.min(prev + 1, stock))
	}

	const decreaseQuantity = () => {
		setQuantity((prev) => Math.max(prev - 1, 1))
	}

	return (
		<div className="flex items-center gap-4">
			<div>
				<Label className="text-base" htmlFor="quantity">
					Quantity
				</Label>
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-2">
						<div className="flex w-[100px] items-center justify-between gap-2 rounded-full bg-muted px-3 py-1">
							<Button
								className="h-4 w-4 text-gray-500 hover:bg-transparent dark:text-gray-400"
								size="icon"
								variant="ghost"
								onClick={decreaseQuantity}
							>
								<MinusIcon className="h-4 w-4" />
								<span className="sr-only">Decrease quantity</span>
							</Button>
							<span className="text-base font-medium">{quantity}</span>
							<Button
								className="h-4 w-4 text-gray-500 hover:bg-transparent dark:text-gray-400"
								size="icon"
								variant="ghost"
								onClick={increaseQuantity}
							>
								<PlusIcon className="h-4 w-4" />
								<span className="sr-only">Increase quantity</span>
							</Button>
						</div>
					</div>
				</div>
				{stock === quantity && (
					<p className="mb-2 text-sm text-red-500">
						You&apos;ve selected the maximum available stock.
					</p>
				)}
			</div>
		</div>
	)
}
