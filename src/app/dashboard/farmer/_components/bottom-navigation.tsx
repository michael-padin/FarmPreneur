"use client"
import { useNotifications } from "@/contexts/notification-context"
import {
	Bell,
	Box,
	Home,
	MessageCircleMore,
	ShoppingCart,
	User
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function BottomNav() {
	const { unreadCount } = useNotifications()
	const pathName = usePathname()
	return (
		<nav className="fixed bottom-0 left-0 right-0 border-t bg-background md:hidden">
			<div className="flex justify-between p-3 py-6">
				{[
					{ icon: Home, label: "Home", url: "/dashboard/farmer" },
					{
						icon: ShoppingCart,
						label: "Orders",
						url: "/dashboard/farmer/orders"
					},
					{ icon: Box, label: "Products", url: "/dashboard/farmer/products" },
					{
						icon: Bell,
						label: "Notifications",
						url: "/dashboard/farmer/notifications",
						badge: unreadCount > 0 ? unreadCount : null
					},
					{
						icon: MessageCircleMore,
						label: "Messages",
						url: "/dashboard/farmer/messages",
						badge: unreadCount > 0 ? unreadCount : null
					},
					{ icon: User, label: "Profile", url: "/dashboard/farmer/profile" }
				].map((item, index) => (
					<Link
						key={index}
						href={`${item.url}`}
						className={`${
							pathName === item.url ? "text-primary" : "text-muted-foreground"
						}`}
					>
						<div className="relative flex flex-col items-center gap-1">
							<div className="truncate">
								<item.icon className="h-6 w-6" />
							</div>
							{item.badge && (
								<span className="absolute -top-1 right-2.5 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-center text-xs font-semibold leading-none text-white">
									{item.badge}
								</span>
							)}
							<span className="max-w-14 truncate text-[11px]">
								{item.label}
							</span>
						</div>
					</Link>
				))}
			</div>
		</nav>
	)
}
