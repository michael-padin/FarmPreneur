"use client"

import { FPSignOutButton } from "@/components/fp/fp-signout-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
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
	SidebarRail,
	useSidebar
} from "@/components/ui/sidebar"
import { SidebarItem } from "@/constants/navItems"
import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	TestTubeDiagonal
} from "lucide-react"
import { Session } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DashboardSidebarProps {
	user: Session["user"] | undefined
	items: SidebarItem[]
}

export function DashboardSidebar({ user, items }: DashboardSidebarProps) {
	const { setOpenMobile } = useSidebar()
	const pathName = usePathname()
	const splitIndex = user?.role === "ADMIN" ? 2 : 3
	const splitIndexForSub = user?.role === "ADMIN" ? 3 : 4

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
								<Image
									className="rounded-lg border object-cover"
									src={"/web-app-manifest-512x512.png"}
									alt={"FarmerPreneur Logo"}
									width={40}
									height={40}
									priority
									sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
								/>
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
										isActive={
											pathName.split("/")[splitIndex] ===
											item.url.split("/")[splitIndex]
										}
									>
										<Link href={item.url} onClick={() => setOpenMobile(false)}>
											{item.icon && <item.icon />}
											<span>{item.name}</span>
											{item.badge !== 0 && item.badge && (
												<SidebarMenuBadge className="bg-primary text-primary-foreground">
													{item.badge}
												</SidebarMenuBadge>
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
															pathName.split("/")[splitIndexForSub] ===
															subItem.url.split("/")[splitIndexForSub]
														}
														// size="sm"
													>
														<Link
															href={subItem.url}
															onClick={() => setOpenMobile(false)}
														>
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
