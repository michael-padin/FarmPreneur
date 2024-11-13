import { auth } from "@/auth"
import React from "react"

import { Metadata } from "next"
import ThemeProvider from "@/components/theme-provider"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { PendingFarmerCountProvider } from "@/contexts/pending-farmer-count-context"
import { DashboardSidebar } from "../_components/sidebar"

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
		<>
			<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
				<PendingFarmerCountProvider>
					<SidebarProvider>
						<DashboardSidebar user={user} />
						<SidebarInset className="overflow-hidden">{children}</SidebarInset>
					</SidebarProvider>
				</PendingFarmerCountProvider>
			</ThemeProvider>
		</>
	)
}
