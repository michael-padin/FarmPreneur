"use client"

import { LayoutDashboardIcon, LucideProps } from "lucide-react"

import {
	Sidebar,
	SidebarContent,
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

type NavItems = {
	url: string
	name: string
	icon?: React.ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
	>
	items?: NavItems[]
}

interface DashboardSidebarProps {
	name: string
	items: NavItems[]
}

export default function DashboardSidebar({
	items,
	name
}: DashboardSidebarProps) {
	const pathName = usePathname()

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
									<LayoutDashboardIcon className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">FarmPreneur</span>
									<span className="truncate text-xs">{name}</span>
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
											<SidebarMenuBadge>24</SidebarMenuBadge>
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
															{/* <SidebarMenuBadge>24</SidebarMenuBadge> */}
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
			<SidebarRail />
		</Sidebar>
	)
}
