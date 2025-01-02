"use client"

import { NotificationItem } from "@/app/_components/notification-item"
import { useNotifications } from "@/contexts/notification-context"
import { getNotificationsByUserIdUseCase } from "@/use-cases/notifications"
import { Bell, CircleCheckBig } from "lucide-react"
import { use } from "react"
import { NotificationIcon } from "./notification-icon"

interface NotificationListProps {
	notificationsPromise: Promise<
		Awaited<ReturnType<typeof getNotificationsByUserIdUseCase>>
	>
}

export const NotificationList = ({
	notificationsPromise
}: NotificationListProps) => {
	const initialNotifications = use(notificationsPromise)
	const { markAsRead, markAllAsRead, notifications } = useNotifications()

	return (
		<div className="p-2 px-4">
			<div className="flex justify-end">
				<button
					onClick={markAllAsRead}
					className="relative flex items-center justify-center rounded-full bg-secondary p-2 text-primary"
				>
					<CircleCheckBig className="h-6 w-6" />
					<span className="sr-only">Mark all as read</span>
				</button>
			</div>
			{notifications.length > 0 ? (
				notifications.map((notif) => (
					<NotificationItem
						key={notif.id}
						{...notif}
						markAsRead={markAsRead}
						Icon={
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
								<NotificationIcon type={notif.type} className="h-5 w-5" />
							</div>
						}
					/>
				))
			) : (
				<div className="pt-20">
					<div className="flex h-full flex-col items-center justify-center text-muted-foreground">
						<div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
							<Bell className="h-8 w-8" />
						</div>
						<p className="text-sm">No notifications yet</p>
					</div>
				</div>
			)}
		</div>
	)
}
