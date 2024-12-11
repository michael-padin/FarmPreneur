"use client"

import { NavLink } from "@/app/(home)/_components/nav-link"
import { useCart } from "@/contexts/cart-context"
import { cn } from "@/lib/utils"
import { ArrowLeft, MessageCircleMore, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { SearchSheet } from "../../../_components/search-sheet"

export function TopNav() {
	const {
		cart: { distinctProductsCount }
	} = useCart()
	const countMessages = 10
	const router = useRouter()
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
		scrolled ? "bg-transparent text-primary" : "bg-black/20 text-white"
	)

	const badgeClasses = cn(
		"absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[0.6rem] font-medium text-primary-foreground"
	)

	return (
		<div
			className={cn(
				"fixed left-0 right-0 top-0 z-10",
				scrolled ? "bg-white shadow-md" : "bg-transparent"
			)}
		>
			<div className="flex items-center justify-between p-3 px-1.5">
				<div className={navButtonClasses}>
					<button
						className="cursor-pointer hover:bg-transparent hover:text-current"
						onClick={() => router.back()}
					>
						<ArrowLeft className="h-6 w-6" />
					</button>
				</div>
				<div className="flex gap-2">
					<div className={cn(navButtonClasses)}>
						<SearchSheet scrolled={scrolled} />
					</div>
					<NavLink
						href="/cart"
						count={distinctProductsCount}
						Icon={ShoppingCart}
						navButtonClasses={navButtonClasses}
						badgeClasses={badgeClasses}
					/>
					<NavLink
						href="/messages"
						count={countMessages}
						Icon={MessageCircleMore}
						navButtonClasses={navButtonClasses}
						badgeClasses={badgeClasses}
					/>
				</div>
			</div>
		</div>
	)
}
