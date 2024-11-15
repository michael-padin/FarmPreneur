import {
	BellRing,
	Home,
	LineChart,
	LucideProps,
	MessageCircleCode,
	Package,
	ShoppingCart,
	UserCheck,
	Users
} from "lucide-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"

export type SidebarItem = {
	name: string
	url: string
	icon?: ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
	>
	badge?: number | string
	items?: SidebarItem[]
}

export const farmerNavItems: SidebarItem[] = [
	{
		name: "Dashboard",
		url: "/dashboard/farmer",
		icon: Home
	},

	{
		name: "Customers",
		url: "/dashboard/farmers/customers",
		icon: UserCheck
	},
	{
		name: "Products",
		url: "/dashboard/farmer/products",
		icon: Package
	},
	{
		name: "Messages",
		url: "/dashboard/farmer/messages",
		icon: MessageCircleCode
	},
	{
		name: "Notifications",
		url: "/dashboard/farmer/notifications",
		icon: BellRing
	},
	{
		url: "/dashboard/farmer/analytics",
		icon: LineChart,
		name: "Analytics"
	}
]

export const testSidebarItems = [
	{
		name: "Session",
		url: "#",
		items: [
			{ name: "Client Page", url: "/tests/auth/session/client" },
			{ name: "Server Page", url: "/tests/auth/session/server" }
		]
	}
]
