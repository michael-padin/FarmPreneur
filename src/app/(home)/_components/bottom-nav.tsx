"use client"
import { useNotifications } from "@/contexts/notification-context"
import { Bell, Box, Home, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const BottomNav = () => {
	const { unreadCount } = useNotifications()
	const pathName = usePathname()
	const navItems = [
		{ label: "Home", icon: Home, url: "/" },
		{ label: "Orders", icon: Box, url: "/orders" },
		{
			label: "Notifications",
			icon: Bell,
			url: "/notifications",
			badge: unreadCount > 0 ? unreadCount : null
		},
		{ label: "Profile", icon: User, url: "/profile" }
	]
	return (
		<nav className="fixed bottom-0 left-0 right-0 border-t bg-background md:hidden">
			<div className="flex justify-around p-3">
				{navItems.map((item, index) => (
					<Link
						key={index}
						href={`${item.url}`}
						className={`flex flex-col items-center gap-1 ${
							pathName === item.url ? "text-primary" : "text-muted-foreground"
						}`}
					>
						<div className="relative">
							<item.icon className="h-6 w-6" />
							{item.badge && (
								<span className="absolute -right-1 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-center text-xs font-semibold leading-none text-white">
									{item.badge}
								</span>
							)}
						</div>
						<span className="text-xs">{item.label}</span>
					</Link>
				))}
			</div>
		</nav>
	)
}

export default BottomNav
