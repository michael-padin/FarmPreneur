"use client"
import { Button, ButtonProps } from "@/components/ui/button"
import { useQuantity } from "@/contexts/quantity-context"
import { cn } from "@/lib/utils"
import { getProductBySlugUseCase } from "@/use-cases/products"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface BuyNowProps extends ButtonProps {
	product: Awaited<ReturnType<typeof getProductBySlugUseCase>>
	className?: string
}

export function BuyNow({ product, className, ...props }: BuyNowProps) {
	const router = useRouter()
	const { quantity: inputtedQuantity } = useQuantity()

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
		<Button
			className={cn("flex w-full", className)}
			type="button"
			onClick={handleBuyNow}
			{...props}
		>
			Buy Now
		</Button>
	)
}
