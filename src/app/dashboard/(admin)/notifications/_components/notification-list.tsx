"use client"

import { NotificationItem } from "@/app/_components/notification-item"
import { useNotifications } from "@/contexts/notification-context"
import { NotificationIcon } from "./notification-icon"
import { Button } from "@/components/ui/button"
import { NotificationType } from "@prisma/client"
import Link from "next/link"
import { Notification } from "@/types/notification"

export const NotificationList = () => {
	const { markAllAsRead, markAsRead, notifications } = useNotifications()

	const getNotifItemLink = (notif: Notification) => {
		switch (notif.type) {
			case NotificationType.ORDER_STATUS:
				const hasOrderId = !!notif.metadata.orderId
				return hasOrderId ? `/dashboard/orders/${notif.metadata.orderId}` : "#"
			case NotificationType.FARMER_APPROVAL:
				const hasUserId = !!notif.metadata?.userId
				return hasUserId
					? `/dashboard/users/${notif.metadata.userId}/edit`
					: "#"
			case NotificationType.PRODUCT_APPROVAL:
			// return `/dashboard/products/${notification.id}`
			case NotificationType.NEW_MESSAGE:
			// return `/dashboard/messages/${notification.id}`
			case NotificationType.NEW_PRODUCT:
			// return `/dashboard/products/${notification.id}`
			case NotificationType.PROMOTION:
			// return `/dashboard/products/${notification.id}`
			case NotificationType.SYSTEM_ALERT:
			// return `/dashboard/messages/${notification.id}`
			case NotificationType.VERIFICATION:
			// return `/dashboard/users/${notification.id}`
			default:
				return `#`
		}
	}

	return (
		<div className="lg:container lg:mx-auto lg:rounded-lg lg:border lg:bg-card lg:p-6">
			<div className="flex items-center justify-between pb-4">
				<h2 className="text-2xl font-semibold leading-none tracking-tight">
					Notifications
				</h2>
				<Button variant="default" size="sm" onClick={markAllAsRead}>
					Read all
				</Button>
			</div>
			<div className="">
				{notifications.map((notif) => (
					<Link
						href={getNotifItemLink(notif) || "#"}
						key={notif.id}
						onClick={() => !notif.isRead && markAsRead(notif.id)}
					>
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
					</Link>
				))}
			</div>
		</div>
	)
}
