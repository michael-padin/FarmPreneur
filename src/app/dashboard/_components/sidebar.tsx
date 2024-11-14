"use client"

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { farmerNavItems, SidebarItem } from "@/constants/navItems"
import {
	BadgeCheck,
	Bell,
	BellRing,
	ChevronsUpDown,
	Command,
	Home,
	LayoutGrid,
	LeafyGreen,
	LineChart,
	ShoppingCart,
	TestTubeDiagonal,
	Users
} from "lucide-react"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Session } from "next-auth"
import { FPSignOutButton } from "@/components/fg/fp-signout-button"
import { usePendingFarmerCount } from "@/contexts/pending-farmer-count-context"

interface DashboardSidebarProps {
	user: Session["user"] | undefined
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
	const { pendingFarmerCount } = usePendingFarmerCount()
	const pathName = usePathname()

	console.log("pendingFarmerCount :>> ", pendingFarmerCount)

	const adminNavItems: SidebarItem[] = [
		{
			name: "Dashboard",
			url: "/dashboard",
			icon: Home
		},

		{
			name: "Users",
			url: "/dashboard/users",
			icon: Users,
			items: [
				{
					name: "Customers",
					url: "/dashboard/users/customers"
					// icon: UserCheck
				},
				{
					name: "Farmers",
					url: "/dashboard/users/farmers"
					// icon: Sprout
				},
				{
					name: "Pending Farmers",
					url: "/dashboard/users/pending-farmers",
					badge: pendingFarmerCount
					// icon: Hourglass
				}
			]
		},
		{
			name: "Products",
			url: "/dashboard/products",
			icon: LeafyGreen
		},
		{
			name: "Categories",
			url: "/dashboard/categories",
			icon: LayoutGrid
		},
		{
			name: "Orders",
			url: "/dashboard/orders",
			icon: ShoppingCart
		},

		{
			name: "Notifications",
			url: "/dashboard/notifications",
			icon: BellRing
		},

		{
			url: "/dashboard/analytics",
			icon: LineChart,
			name: "Analytics"
		}
	]
	const items = user?.role === "ADMIN" ? adminNavItems : farmerNavItems

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							asChild
						>
							<a href="#">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<Command className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">FarmPreneur</span>
									<span className="truncate text-xs">{user?.name}</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				{/* We create a SidebarGroup for each parent. */}
				<SidebarGroup>
					<SidebarGroupLabel>Main</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.name}>
									<SidebarMenuButton
										asChild
										tooltip={item.name}
										isActive={pathName.split("/")[2] === item.url.split("/")[2]}
									>
										<Link href={item.url}>
											{item.icon && <item.icon />}
											<span>{item.name}</span>
											{item.badge && (
												<SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
											)}
										</Link>
									</SidebarMenuButton>
									{item.items && (
										<SidebarMenuSub>
											{item.items.map((subItem) => (
												<SidebarMenuSubItem key={subItem.name}>
													<SidebarMenuSubButton
														asChild
														isActive={
															pathName.split("/")[3] ===
															subItem.url.split("/")[3]
														}
														// size="sm"
													>
														<Link href={subItem.url}>
															{/* {subItem.icon && <subItem.icon />} */}
															<span>{subItem.name}</span>
															{/* TODO: Add Badge number for pending farmers */}
															{subItem.badge !== 0 && subItem.badge && (
																<SidebarMenuBadge className="bg-primary text-primary-foreground">
																	{subItem.badge}
																</SidebarMenuBadge>
															)}
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									)}
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size="lg"
									className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage
											src={user?.image || ""}
											alt={user?.name || "user avatar"}
										/>
										<AvatarFallback className="rounded-lg">
											{user?.name?.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">{user?.name}</span>
										<span className="truncate text-xs">{user?.email}</span>
									</div>
									<ChevronsUpDown className="ml-auto size-4" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
								side="bottom"
								align="end"
								sideOffset={4}
							>
								<DropdownMenuLabel className="p-0 font-normal">
									<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
										<Avatar className="h-8 w-8 rounded-lg">
											<AvatarImage
												src={user?.image || ""}
												alt={user?.name || "user avatar"}
											/>
											<AvatarFallback className="rounded-lg">
												{user?.name?.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-semibold">
												{user?.name}
											</span>
											<span className="truncate text-xs">{user?.email}</span>
										</div>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem asChild>
										<Link href="/dashboard/account">
											<BadgeCheck />
											Account
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href={`/dashboard/notifications`}>
											<Bell />
											Notifications
										</Link>
									</DropdownMenuItem>
									{user?.role === "ADMIN" && (
										<DropdownMenuItem asChild>
											<Link href={`/tests`}>
												<TestTubeDiagonal />
												Test Dashboard
											</Link>
										</DropdownMenuItem>
									)}
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<FPSignOutButton className="w-full" />
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
