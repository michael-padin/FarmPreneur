"use client"
import { useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, Bell, Heart } from "lucide-react"
import IconBadge from "@/components/fg/fg-icon-badge"

const navItems = [
	{ name: "Home", icon: Home, href: "/" },
	{ name: "Likes", icon: Heart, href: "/likes" },
	{ name: "Notifications", icon: Bell, href: "/notifications" },
	{ name: "Me", icon: User, href: "/me" }
]

const BottomNav = () => {
	const pathname = usePathname()
	const navRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const activeItem = navRef.current?.querySelector(`a[href="${pathname}"]`)
		if (activeItem) {
			activeItem.scrollIntoView({
				inline: "center",
				block: "nearest"
			})
		}
	}, [pathname])

	return (
		<nav className="fixed bottom-0 left-0 right-0 z-40 bg-background">
			<div className="mx-auto max-w-screen-xl shadow-2xl shadow-black">
				<div
					ref={navRef}
					className="scrollbar-hide flex justify-around overflow-x-auto"
					style={{ scrollSnapType: "x mandatory" }}
				>
					{navItems.map((item) => {
						const isActive = pathname === item.href
						return (
							<Link
								key={item.name}
								href={item.href}
								className={`flex min-w-[4rem] flex-col items-center justify-center py-2 transition-all duration-300 ease-in-out ${
									isActive ? "text-primary" : "text-foreground"
								}`}
								style={{ scrollSnapAlign: "center" }}
								aria-label={item.name}
							>
								<div>
									<IconBadge
										icon={item.icon}
										count={item.name === "Notifications" ? 12 : 0}
										badgePosition="top-right"
										size="icon"
										variant="ghost"
										badgeColor="bg-primary text-white"
										iconColor={`${isActive ? "fill-primary stroke-primary" : "stroke-foreground fill-none"}`}
									/>
								</div>
								<span className="-mt-2 line-clamp-1 text-xs font-medium">
									{item.name}
								</span>
							</Link>
						)
					})}
				</div>
			</div>
		</nav>
	)
}

export default BottomNav
