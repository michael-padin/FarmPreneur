import { auth } from "@/auth"
import React from "react"

import ThemeProvider from "@/components/theme-provider"
import { Metadata } from "next"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { PendingFarmerCountProvider } from "@/contexts/pending-farmer-count-context"

import { NotificationProvider } from "@/contexts/notification-context"
import { getNotificationsByUserIdUseCase } from "@/use-cases/notifications"
import { AdminSidebar } from "../_components/admin-sidebar"

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

	if (session?.user.role !== "ADMIN" || !user) {
		return <p>Sorry, You are not authorized to view this page</p>
	}
	const initialNotificationsPromise = getNotificationsByUserIdUseCase()

	return (
		<>
			<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
				<NotificationProvider
					initialNotificationsPromise={initialNotificationsPromise}
					userId={session.user.id}
				>
					<PendingFarmerCountProvider>
						<SidebarProvider>
							<AdminSidebar user={user} />
							<SidebarInset className="overflow-hidden dark:bg-background">
								{children}
							</SidebarInset>
						</SidebarProvider>
					</PendingFarmerCountProvider>
				</NotificationProvider>
			</ThemeProvider>
		</>
	)
}
