"use client"
import { Home, ShoppingCart, Box, User, Bell } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function BottomNav() {
	const pathName = usePathname()
	return (
		<nav className="fixed bottom-0 left-0 right-0 border-t bg-background md:hidden">
			<div className="flex justify-around p-4">
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
						url: "/dashboard/farmer/notifications"
					},
					{ icon: User, label: "Profile", url: "/dashboard/farmer/profile" }
				].map((item, index) => (
					<Link
						key={index}
						href={`${item.url}`}
						className={`flex flex-col items-center gap-1 ${
							pathName === item.url ? "text-primary" : "text-muted-foreground"
						}`}
					>
						<item.icon className="h-6 w-6" />
						<span className="text-xs">{item.label}</span>
					</Link>
				))}
			</div>
		</nav>
	)
}
