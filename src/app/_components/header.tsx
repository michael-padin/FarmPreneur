import { auth } from "@/auth"
import { FPSignOutButton } from "@/components/fg/fp-signout-button"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	MessageCircle,
	TestTubeDiagonal
} from "lucide-react"
import { Session } from "next-auth"
import Link from "next/link"

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
				<div className="flex w-full items-center justify-end gap-1">
					<ModeToggle />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant={"ghost"} size="icon">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage
										src={user?.image || ""}
										alt={user?.name || "user avatar"}
									/>
									<AvatarFallback className="rounded-lg">
										{user?.name?.charAt(0)}
									</AvatarFallback>
								</Avatar>
							</Button>
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
							<DropdownMenuSeparator />
							<DropdownMenuRadioGroup>
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
							</DropdownMenuRadioGroup>
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
