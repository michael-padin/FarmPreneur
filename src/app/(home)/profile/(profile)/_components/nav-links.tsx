"use client"

import { NavLink } from "@/app/(home)/_components/nav-link"
import { useCart } from "@/contexts/cart-context"
import { cn } from "@/lib/utils"
import { ShoppingCart } from "lucide-react"

export function ProfileNavLinks() {
	const {
		cart: { distinctProductsCount }
	} = useCart()
	const countMessages = 10

	const navButtonClasses = cn(
		"flex items-center justify-center rounded-full p-1.5",
		"bg-transparent text-primary"
	)

	const badgeClasses = cn(
		"absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[0.6rem] font-medium text-primary-foreground"
	)
	return (
		<div className="flex gap-3">
			<NavLink
				href="/cart"
				count={distinctProductsCount}
				Icon={ShoppingCart}
				navButtonClasses={navButtonClasses}
				badgeClasses={badgeClasses}
			/>
			{/* <NavLink
				href="/messages"
				count={countMessages}
				Icon={MessageCircleMore}
				navButtonClasses={navButtonClasses}
				badgeClasses={badgeClasses}
			/> */}
		</div>
	)
}
