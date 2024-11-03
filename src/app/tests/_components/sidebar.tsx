"use client"
import { buttonVariants } from "@/components/ui/button"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail
} from "@/components/ui/sidebar"
import { SidebarItem } from "@/constants/navItems"
import { cn } from "@/lib/utils"
import { ArrowLeft, Command } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface TestsSidebarProps {
	items: SidebarItem[]
}

const TestsSidebar = ({ items }: TestsSidebarProps) => {
	const pathName = usePathname()
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuSubItem>
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
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuSubItem>
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
										</Link>
									</SidebarMenuButton>
									{item.items && (
										<SidebarMenuSub>
											{item.items.map((subItem) => (
												<SidebarMenuSubItem key={subItem.name}>
													<SidebarMenuSubButton
														asChild
														isActive={
															pathName.split("/")[4] ===
															subItem.url.split("/")[4]
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
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							asChild
						>
							<Link href="/dashboard">
								<ArrowLeft />
								Back to Dashboard
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}

export default TestsSidebar
