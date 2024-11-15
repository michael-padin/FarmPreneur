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
import { ModeToggle } from "@/components/mode-toggle"
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
