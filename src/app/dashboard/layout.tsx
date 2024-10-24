import { auth } from "@/auth"
import { redirect } from "next/navigation"
import React from "react"

import DashboardSidebar from "./_components/sidebar"
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

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Your dashboard"
}
interface DashboardLayoutProps {
	farmer: React.ReactNode
	admin: React.ReactNode
}

const DashboardLayout = async ({ farmer, admin }: DashboardLayoutProps) => {
	const session = await auth()

	if (
		!session ||
		!session.user ||
		!["FARMER", "ADMIN"].includes(session?.user.role)
	) {
		redirect("/login")
	}

	const role = session?.user.role

	return (
		<>
			<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
				<SidebarProvider>
					<DashboardSidebar
						role={role as "FARMER" | "ADMIN"}
						farmName={session.user.name || "Admin"}
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
						{role === "ADMIN" ? admin : farmer}
					</SidebarInset>
				</SidebarProvider>
			</ThemeProvider>
		</>
	)
}

export default DashboardLayout
