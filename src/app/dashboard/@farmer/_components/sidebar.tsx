"use client"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
	Home,
	LineChart,
	Package,
	Package2,
	PanelLeft,
	Settings,
	ShoppingCart,
	Users2
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DesktopSidebarProps {
	name: string
}

export const DesktopSidebar = ({ name }: DesktopSidebarProps) => {
	const pathname = usePathname()
	console.log("pathname", pathname)

	const isActiveLink = (path: string) => pathname === path
	return (
		<>
			<aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
				<nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
					<Link
						href="/dashboard"
						className={cn(
							"group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full",
							isActiveLink("/dashboard")
								? "bg-primary text-primary-foreground"
								: "bg-muted text-muted-foreground"
						)}
					>
						<Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
						<h1 className="sr-only">{name}</h1>
					</Link>

					{[
						{ href: "/dashboard", icon: <Home />, label: "Dashboard" },
						{
							href: "/dashboard/orders",
							icon: <ShoppingCart />,
							label: "Orders"
						},
						{
							href: "/dashboard/products",
							icon: <Package />,
							label: "Products"
						},
						{ href: "/dashboard/buyers", icon: <Users2 />, label: "Customers" },
						{
							href: "/dashboard/analytics",
							icon: <LineChart />,
							label: "Analytics"
						}
					].map(({ href, icon, label }) => (
						<Tooltip key={href}>
							<TooltipTrigger asChild>
								<Link
									href={href}
									className={cn(
										"flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8",
										isActiveLink(href)
											? "bg-accent text-accent-foreground"
											: "text-muted-foreground hover:text-foreground"
									)}
								>
									{icon}
									<span className="sr-only">{label}</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right">{label}</TooltipContent>
						</Tooltip>
					))}
				</nav>

				<nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								href="/dashboard/settings"
								className={cn(
									"flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8",
									isActiveLink("/dashboard/settings")
										? "bg-accent text-accent-foreground"
										: "text-muted-foreground hover:text-foreground"
								)}
							>
								<Settings className="h-5 w-5" />
								<span className="sr-only">Settings</span>
							</Link>
						</TooltipTrigger>
						<TooltipContent side="right">Settings</TooltipContent>
					</Tooltip>
				</nav>
			</aside>
		</>
	)
}

interface MobileSidebarProps {
	name: string
}

export const MobileSidebar = ({ name }: MobileSidebarProps) => {
	const pathname = usePathname()
	console.log("pathname", pathname)

	const isActiveLink = (path: string) => pathname === path
	return (
		<>
			<Sheet>
				<SheetTrigger asChild>
					<Button size="icon" variant="outline" className="sm:hidden">
						<PanelLeft className="h-5 w-5" />
						<span className="sr-only">Toggle Menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="sm:max-w-xs">
					<nav className="grid gap-2 text-lg font-medium">
						<Link
							href="/dashboard"
							className="mb-5 flex w-full items-center gap-2 text-lg font-semibold text-primary-foreground md:text-base"
						>
							<Package2 className="h-10 w-10 rounded-full bg-primary p-1 transition-all" />
							<span className="text-foreground">{name}</span>
						</Link>
						{/* Render menu items */}
						{[
							{ href: "/dashboard", label: "Dashboard", icon: <Home /> },
							{
								href: "/dashboard/orders",
								label: "Orders",
								icon: <ShoppingCart />
							},
							{
								href: "/dashboard/products",
								label: "Products",
								icon: <Package />
							},
							{
								href: "/dashboard/buyers",
								label: "Customers",
								icon: <Users2 />
							},
							{
								href: "/dashboard/settings",
								label: "Settings",
								icon: <Settings />
							}
						].map(({ href, label, icon }) => (
							<Link
								key={href}
								href={href}
								className={cn(
									"flex items-center gap-4 rounded-lg p-2 text-muted-foreground hover:text-foreground",
									isActiveLink(href)
										? "bg-primary text-primary-foreground hover:text-white"
										: "text-muted-foreground hover:text-foreground"
								)}
							>
								{icon}
								{label}
							</Link>
						))}
					</nav>
				</SheetContent>
			</Sheet>
		</>
	)
}
