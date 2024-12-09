"use client"

import { useCart } from "@/contexts/cart-context"
import { cn } from "@/lib/utils"
import { ShoppingCart } from "lucide-react"
import { NavLink } from "./nav-link"

export function CartNavItem() {
	const {
		cart: { distinctProductsCount }
	} = useCart()

	const navButtonClasses = cn(
		"flex items-center justify-center rounded-full p-1.5",
		scrolled ? "bg-transparent text-primary" : "bg-black/20 text-white"
	)

	return (
		<NavLink
			count={distinctProductsCount}
			href="/cart"
			Icon={ShoppingCart}
			navButtonClasses={navButtonClasses}
			badgeClasses="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[0.6rem] font-medium text-primary-foreground"
		/>
	)
}
