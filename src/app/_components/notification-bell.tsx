"use client"

import { Button } from "@/components/ui/button"
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from "@/contexts/notification-context"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Bell } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { NotificationIcon } from "../dashboard/(admin)/notifications/_components/notification-icon"
import { NotificationItem } from "./notification-item"

export function NotificationBell() {
	const [open, setOpen] = useState(false)
	const isDesktop = useMediaQuery("(min-width: 768px)")
	const { readNotification, notifications, unreadCount } = useNotifications()

	return (
		<Popover onOpenChange={setOpen} open={open}>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon" className="relative">
					<Bell className="h-5 w-5" />
					{unreadCount > 0 && (
						<span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
							{unreadCount}
						</span>
					)}
					<span className="sr-only">Toggle notifications</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<div className="flex items-center justify-between pb-2">
					<h2 className="text-lg font-semibold">Notifications</h2>
					<Button
						variant="link"
						size="sm"
						asChild
						onClick={() => setOpen(false)}
					>
						<Link href="/dashboard/notifications" className="">
							See all
						</Link>
					</Button>
				</div>
				<ScrollArea className="h-[300px]">
					<div className="">
						{notifications.map((notif) => (
							<NotificationItem
								key={notif.id}
								{...notif}
								markAsRead={readNotification}
								titleClassName="text-sm"
								bodyClassName="text-xs"
								Icon={
									<div className="flex h-8 min-w-8 items-center justify-center rounded-full bg-primary/10">
										<NotificationIcon type={notif.type} className="h-5 w-5" />
									</div>
								}
							/>
						))}
					</div>
				</ScrollArea>
			</PopoverContent>
		</Popover>
	)
}
