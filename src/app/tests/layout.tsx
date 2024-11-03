import { ModeToggle } from "@/components/mode-toggle"
import { Separator } from "@/components/ui/separator"
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger
} from "@/components/ui/sidebar"
import { ThemeProvider } from "next-themes"
import TestsSidebar from "./_components/sidebar"
import { testSidebarItems } from "@/constants/navItems"

export default function TestsLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
			<SidebarProvider>
				<TestsSidebar items={testSidebarItems} />
				<SidebarInset className="overflow-hidden">
					<header className="w-full border-b px-4">
						<div className="flex w-full items-center">
							<div className="flex h-16 shrink-0 items-center gap-2">
								<SidebarTrigger className="-ml-1" />
								<Separator orientation="vertical" className="mr-2 h-4" />
							</div>
							<div className="flex w-full items-center justify-end gap-2">
								<ModeToggle />
							</div>
						</div>
					</header>
					<main className="p-4">{children}</main>
				</SidebarInset>
			</SidebarProvider>
		</ThemeProvider>
	)
}
