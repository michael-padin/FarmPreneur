import { auth } from "@/auth"
import { redirect } from "next/navigation"
import React from "react"

import { Metadata } from "next"
import ThemeProvider from "@/components/theme-provider"

import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Bell, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getUserFarmerByIdUseCase } from "@/use-cases/users"
import { FarmerSidebar } from "./_components/sidebar"

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
			<SidebarProvider>
				<FarmerSidebar user={session.user} />
				{children}
			</SidebarProvider>
		</ThemeProvider>
	)
}
