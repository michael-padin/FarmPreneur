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
import { formatDistanceToNowStrict } from "date-fns"
import { Bell, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { NotificationIcon } from "../dashboard/(admin)/notifications/_components/notification-icon"

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
					{notifications.map((notification) => (
						<div
							key={notification.id}
							className={`flex items-start gap-2 ${notification.isRead ? "opacity-50" : ""} py-1`}
						>
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
								<NotificationIcon
									type={notification.type}
									className="h-4 w-4"
								/>
							</div>{" "}
							<div className="flex-1">
								<div className="flex items-center gap-2">
									<p className="text-sm font-medium">{notification.title}</p>
									{!notification.isRead && (
										<span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
									)}
								</div>
								<p className="text-xs text-muted-foreground">
									{notification.message}
								</p>
								<p className="text-xs text-muted-foreground">
									{formatDistanceToNowStrict(notification.createdAt, {
										addSuffix: true
									})}
								</p>
							</div>
							{!notification.isRead && (
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8"
									onClick={() => readNotification(notification.id)}
								>
									<X className="h-4 w-4" />
									<span className="sr-only">Mark as read</span>
								</Button>
							)}
						</div>
					))}
				</ScrollArea>
			</PopoverContent>
		</Popover>
	)
}
