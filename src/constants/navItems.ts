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
	items?: SidebarItem[]
}

export const farmerNavItems: SidebarItem[] = [
	{
		name: "Dashboard",
		url: "/dashboard",
		icon: Home
	},

	{
		name: "Customers",
		url: "/dashboard/farmers/users/customers",
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

export const adminNavItems: SidebarItem[] = [
	{
		name: "Dashboard",
		url: "/dashboard",
		icon: Home
	},

	{
		name: "Users",
		url: "/dashboard/users",
		icon: Users,
		items: [
			{
				name: "Customers",
				url: "/dashboard/users/customers"
				// icon: UserCheck
			},
			{
				name: "Farmers",
				url: "/dashboard/users/farmers"
				// icon: Sprout
			},
			{
				name: "Pending Farmers",
				url: "/dashboard/users/pending-farmers"
				// icon: Hourglass
			}
		]
	},
	{
		name: "Orders",
		url: "/dashboard/orders",
		icon: ShoppingCart
	},
	{
		name: "Products",
		url: "/dashboard/products",
		icon: Package
	},
	{
		name: "Notifications",
		url: "/dashboard/notifications",
		icon: BellRing
	},

	{
		url: "/dashboard/analytics",
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
