import { auth } from "@/auth"
import { redirect } from "next/navigation"
import React from "react"

import DashboardSidebar from "../_components/sidebar"
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
	MessageCircleCode,
	Package,
	UserCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"

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

export default async function Layout({ children }: DashboardLayoutProps) {
	const session = await auth()

	if (!session) redirect("/login")

	if (session.user.role !== "FARMER") {
		return <p>Sorry, You are not authorized to view this page</p>
	}
	return (
		<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
			<SidebarProvider>
				<DashboardSidebar
					name={session.user.name || "FARMER"}
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
