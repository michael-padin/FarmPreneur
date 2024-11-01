import { auth } from "@/auth"
import React from "react"

import { Metadata } from "next"
import ThemeProvider from "@/components/theme-provider"

import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"
import {
	Bell,
	BellRing,
	Home,
	LineChart,
	MessageCircle,
	Package,
	Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import DashboardSidebar from "../_components/sidebar"

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Your dashboard"
}
interface DashboardLayoutProps {
	children: React.ReactNode
}

const navItems = [
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
				url: "/dashboard/users/waiting-for-approval"
				// icon: Hourglass
			}
		]
	},
	{
		name: "Notifications",
		url: "/dashboard/notifications",
		icon: BellRing
	},
	{
		name: "Products",
		url: "/dashboard/products",
		icon: Package
	},
	{
		url: "/dashboard/analytics",
		icon: LineChart,
		name: "Analytics"
	}
]

export default async function Layout({ children }: DashboardLayoutProps) {
	const session = await auth()

	if (session?.user.role !== "ADMIN") {
		return <p>Sorry, You are not authorized to view this page</p>
	}
	return (
		<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
			<SidebarProvider>
				<DashboardSidebar
					name={session.user.name || "ADMIN"}
					items={navItems}
				/>
				<SidebarInset className="overflow-hidden">
					<header className="w-full border-b px-4">
						<div className="flex w-full items-center">
							<div className="flex h-16 shrink-0 items-center gap-2">
								<SidebarTrigger className="-ml-1" />
								<Separator orientation="vertical" className="mr-2 h-4" />
							</div>
							<div className="flex w-full items-center justify-end gap-2">
								<ModeToggle />
								<Button variant="ghost" size="icon" className="size-8">
									<Bell className="size-4" />
								</Button>
								<Button variant="ghost" size="icon" className="size-8">
									<MessageCircle className="size-4" />
								</Button>
							</div>
						</div>
					</header>
					{children}
				</SidebarInset>
			</SidebarProvider>
		</ThemeProvider>
	)
}
