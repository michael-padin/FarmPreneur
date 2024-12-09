"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/contexts/cart-context"
import { cn } from "@/lib/utils"
import { MessageCircleMore, Search, ShoppingCart } from "lucide-react"
import { Session } from "next-auth"
import Link from "next/link"
import { useEffect, useState } from "react"
import { NavLink } from "./nav-link"

export function MobileNav({ user }: { user: Session["user"] }) {
	const countMessages = 10
	const {
		cart: { distinctProductsCount }
	} = useCart()

	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			const isScrolled = window.scrollY > 60
			if (isScrolled !== scrolled) {
				setScrolled(isScrolled)
			}
		}

		document.addEventListener("scroll", handleScroll, { passive: true })

		return () => {
			document.removeEventListener("scroll", handleScroll)
		}
	}, [scrolled])

	const navButtonClasses = cn(
		"flex items-center justify-center rounded-full p-1.5",
		scrolled ? "bg-transparent text-primary" : "bg-transparent text-white"
	)

	const badgeClasses = cn(
		"absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full text-[0.6rem] font-medium text-primary-foreground",
		scrolled ? "bg-primary text-white" : "bg-white text-primary border-primary"
	)
	return (
		<div
			className={cn(
				"fixed left-0 right-0 top-0 z-10 p-3",
				scrolled ? "bg-white shadow-md" : "bg-transparent"
			)}
		>
			<div className="flex items-center justify-between gap-4 lg:container">
				{user ? (
					<div className="w-full">
						<Input placeholder="Search" className="w-full" />
					</div>
				) : (
					<div>
						<h1 className="text-xl font-bold text-primary">FarmPreneur</h1>
					</div>
				)}

				{user ? (
					<div className="flex items-center gap-4 text-primary-foreground">
						<NavLink
							Icon={ShoppingCart}
							badgeClasses={badgeClasses}
							count={distinctProductsCount}
							href="/cart"
							navButtonClasses={navButtonClasses}
						/>
						<NavLink
							href="/messages"
							count={countMessages}
							Icon={MessageCircleMore}
							navButtonClasses={navButtonClasses}
							badgeClasses={badgeClasses}
						/>
					</div>
				) : (
					<div className="flex items-center gap-4">
						<Search className="text-foreground" />
						<Button variant="default" asChild>
							<Link href="/signup">Sign up</Link>
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}
