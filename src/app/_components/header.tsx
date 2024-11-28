import { auth } from "@/auth"
import { FPSignOutButton } from "@/components/fg/fp-signout-button"
import { ModeToggle } from "@/components/mode-toggle"
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
import { SidebarTrigger } from "@/components/ui/sidebar"
import { BadgeCheck, Bell, TestTubeDiagonal } from "lucide-react"
import Link from "next/link"
import { NotificationBell } from "./notification-bell"

export async function DashboardHeader() {
	const session = await auth()
	const user = session?.user
	return (
		<header className="w-full border-b bg-card px-4">
			<div className="flex w-full items-center">
				<div className="flex h-16 shrink-0 items-center gap-2">
					<SidebarTrigger className="-ml-1" />
					{/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
				</div>
				<div className="flex w-full items-center justify-end gap-4">
					<NotificationBell />
					{/* <ModeToggle />/ */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Avatar className="cursor-pointer rounded-lg">
								<AvatarImage
									src={user?.image || ""}
									alt={user?.name || "user avatar"}
								/>
								<AvatarFallback className="rounded-lg">
									{user?.name?.charAt(0)}
								</AvatarFallback>
							</Avatar>
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
										<span className="truncate font-semibold">{user?.name}</span>
										<span className="truncate text-xs">{user?.email}</span>
									</div>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuGroup>
								<ModeToggle />
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
				</div>
			</div>
		</header>
	)
}
