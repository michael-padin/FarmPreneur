"use client"

import { Session } from "next-auth"
import { SidebarItem } from "@/constants/navItems"
import {
	BellRing,
	Home,
	LayoutGrid,
	LeafyGreen,
	LineChart,
	ShoppingCart,
	Users
} from "lucide-react"
import { usePendingFarmerCount } from "@/contexts/pending-farmer-count-context"
import { DashboardSidebar } from "./sidebar"
import { useNotifications } from "@/contexts/notification-context"

interface AdminSidebarProps {
	user: Session["user"] | undefined
}
export function AdminSidebar({ user }: AdminSidebarProps) {
	const { unreadCount } = useNotifications()
	const { pendingFarmerCount } = usePendingFarmerCount()
	const items: SidebarItem[] = [
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
					url: "/dashboard/users/pending-farmers",
					badge: pendingFarmerCount
					// icon: Hourglass
				}
			]
		},
		{
			name: "Products",
			url: "/dashboard/products",
			icon: LeafyGreen
		},
		{
			name: "Categories",
			url: "/dashboard/categories",
			icon: LayoutGrid
		},
		{
			name: "Orders",
			url: "/dashboard/orders",
			icon: ShoppingCart
		},

		{
			name: "Notifications",
			url: "/dashboard/notifications",
			icon: BellRing,
			badge: unreadCount
		},

		{
			url: "/dashboard/analytics",
			icon: LineChart,
			name: "Analytics"
		}
	]
	return <DashboardSidebar user={user} items={items} />
}
