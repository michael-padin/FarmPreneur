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
import { Bell, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import DashboardSidebar from "../_components/sidebar"

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Your dashboard"
}
interface DashboardLayoutProps {
	children: React.ReactNode
}

export default async function Layout({ children }: DashboardLayoutProps) {
	const session = await auth()
	const user = session?.user

	if (session?.user.role !== "ADMIN") {
		return <p>Sorry, You are not authorized to view this page</p>
	}
	return (
		<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
			<SidebarProvider>
				<DashboardSidebar user={user} />
				<SidebarInset className="overflow-hidden">{children}</SidebarInset>
			</SidebarProvider>
		</ThemeProvider>
	)
}
