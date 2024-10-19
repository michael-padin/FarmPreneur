import { auth } from "@/auth"
import { redirect } from "next/navigation"
import React from "react"

import DashboardSidebar from "./_components/sidebar"
import { Poppins } from "next/font/google"
import { Metadata } from "next"
import ThemeProvider from "@/components/theme-provider"
import { SessionProvider } from "next-auth/react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "sonner"

import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

const inter = Poppins({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700", "800", "900"]
})

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

	if (!session) {
		redirect("/login")
	}

	if (!session.user || !["FARMER", "ADMIN"].includes(session?.user.role)) {
		redirect("/login")
	}

	const role = session?.user.role

	return (
		<>
			<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
				<SessionProvider session={session}>
					<TooltipProvider>
						<SidebarProvider>
							<DashboardSidebar
								role={role as "FARMER" | "ADMIN"}
								farmName={session.user.name || "Admin"}
							/>
							<SidebarInset className="overflow-hidden">
								<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
									<SidebarTrigger className="-ml-1" />
									<Separator orientation="vertical" className="mr-2 h-4" />
								</header>
								{role === "ADMIN" ? admin : farmer}
							</SidebarInset>
						</SidebarProvider>
					</TooltipProvider>
				</SessionProvider>
			</ThemeProvider>
			<Toaster />
		</>
	)
}

export default DashboardLayout
