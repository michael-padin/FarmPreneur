"use client"

import { useCart } from "@/contexts/cart-context"
import { cn } from "@/lib/utils"
import { ShoppingCart } from "lucide-react"
import { motion, useAnimation } from "motion/react"
import Link from "next/link"
import { useEffect, useRef } from "react"

export const FPShoppingCart = ({
	badgeClassName,
	containerClassName,
	iconClassName
}: {
	iconClassName?: string
	badgeClassName?: string
	containerClassName?: string
}) => {
	const { cart, hasCartChanged } = useCart()
	const controls = useAnimation()
	const prevItemCountRef = useRef(0)

	useEffect(() => {
		const itemsCount = cart.totalItems

		if (hasCartChanged && itemsCount !== prevItemCountRef.current) {
			controls.start({
				scale: [1, 1.2, 1],
				transition: { duration: 0.3 }
			})
		}
		prevItemCountRef.current = itemsCount
	}, [cart, hasCartChanged, controls])

	return (
		<Link
			href={`/cart`}
			className="cursor-pointer hover:bg-transparent hover:text-current"
		>
			<motion.div
				className={cn(
					"relative flex items-center justify-center rounded-full p-1.5",
					containerClassName
				)}
				animate={controls}
			>
				<ShoppingCart className={cn("h-6 w-6", iconClassName)} />
				{cart.distinctProductsCount > 0 && (
					<span
						className={cn(
							"absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full text-[0.6rem] font-medium text-primary-foreground",
							badgeClassName
						)}
					>
						{cart.distinctProductsCount}
					</span>
				)}
			</motion.div>
		</Link>
	)
}
