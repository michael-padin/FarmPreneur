import { auth } from "@/auth"
import { redirect } from "next/navigation"
import React from "react"

import ThemeProvider from "@/components/theme-provider"
import { Metadata } from "next"

import { PusherNotificationListener } from "@/app/_components/pusher-notification-listener"
import { DeviceRestriction } from "@/components/device-restriction"
import { PushNotificationManagerWrapper } from "@/components/push-notification-manager-wrapper"
import { NotificationProvider } from "@/contexts/notification-context"
import { getNotificationsByUserIdUseCase } from "@/use-cases/notifications"
import { getUserFarmerByIdUseCase } from "@/use-cases/users"

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Your dashboard"
}
interface DashboardLayoutProps {
	children: React.ReactNode
}

const getUserFarmer = async (id: string) => {
	return await getUserFarmerByIdUseCase(id)
}

export default async function Layout({ children }: DashboardLayoutProps) {
	const session = await auth()

	if (!session?.user) redirect("/login")

	if (session.user.role !== "FARMER") {
		return <p>Sorry, You are not authorized to view this page</p>
	}
	const user = await getUserFarmer(session.user.id!)

	if (!user) redirect("/login")

	if (!user?.farmer) redirect("/farmer-registration")

	const initialNotificationsPromise = getNotificationsByUserIdUseCase()

	return (
		<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
			{/* <SidebarProvider> */}
			<NotificationProvider
				initialNotificationsPromise={initialNotificationsPromise}
				userId={session.user.id}
			>
				<PusherNotificationListener userId={session.user.id} />
				<PushNotificationManagerWrapper />

				{/* <FarmerSidebar user={session.user} /> */}
				<DeviceRestriction user={session.user} role="FARMER">
					{children}
				</DeviceRestriction>
			</NotificationProvider>
			{/* </SidebarProvider> */}
		</ThemeProvider>
	)
}
