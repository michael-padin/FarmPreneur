import { auth } from "@/auth"
import { redirect } from "next/navigation"
import React from "react"

import { Metadata } from "next"
import ThemeProvider from "@/components/theme-provider"

import { SidebarProvider } from "@/components/ui/sidebar"
import { getUserFarmerByIdUseCase } from "@/use-cases/users"
import { FarmerSidebar } from "./_components/sidebar"
import { NotificationProvider } from "@/contexts/notification-context"

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

	if (user.farmer?.applicationStatus === "PENDING") redirect("/admin-approval")
	if (!user?.farmer) redirect("/farmer-registration")

	return (
		<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
			{/* <SidebarProvider> */}
			<NotificationProvider userId={user.id}>
				{/* <FarmerSidebar user={session.user} /> */}
				{children}
			</NotificationProvider>
			{/* </SidebarProvider> */}
		</ThemeProvider>
	)
}
