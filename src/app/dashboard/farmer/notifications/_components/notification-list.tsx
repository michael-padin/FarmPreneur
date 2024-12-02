"use client"

import { NotificationItem } from "@/app/_components/notification-item"
import { useNotifications } from "@/contexts/notification-context"
import { NotificationIcon } from "./notification-icon"
import { Button } from "@/components/ui/button"
import { NotificationType } from "@prisma/client"
import Link from "next/link"
import { Notification } from "@/types/notification"
import { Bell } from "lucide-react"
import { use } from "react"
import { getNotificationsByUserIdUseCase } from "@/use-cases/notifications"

interface NotificationListProps {
	notificationsPromise: Promise<
		Awaited<ReturnType<typeof getNotificationsByUserIdUseCase>>
	>
}

export const NotificationList = ({
	notificationsPromise
}: NotificationListProps) => {
	const initialNotifications = use(notificationsPromise)
	const { markAsRead, notifications, setNotifications } = useNotifications()

	// useEffect(() => {
	// 	setNotifications(initialNotifications)
	// }, [initialNotifications])

	const renderMessage = (notif: Notification) => {
		switch (notif.type) {
			case NotificationType.ORDER_STATUS:
				return null
			case NotificationType.PRODUCT_APPROVAL:
				if (notif.metadata.product?.productListingStatus === "APPROVED") {
					return (
						<div className="mb-2 space-y-1">
							<p className="text-sm">
								You submitted product{" "}
								<span className="capitalize text-primary">
									{notif.metadata.product?.productName}
								</span>{" "}
								has been submitted{" "}
								<span className="text-primary">approved</span>
							</p>{" "}
						</div>
					)
				}
				if (notif.metadata.product?.productListingStatus === "REJECTED") {
					return (
						<div className="mb-2 space-y-1">
							<p className="text-sm">
								You product{" "}
								<span className="capitalize text-primary">
									{notif.metadata.product?.productName}
								</span>{" "}
								has been <span className="text-destructive">rejected</span>.
							</p>
						</div>
					)
				}

			case NotificationType.NEW_MESSAGE:
				return (
					// <NewMessageNotificationItem
					// 	title={notif.title}
					// 	message={notif.message}
					// 	metadata={notif.metadata}
					// />
					null
				)
			default:
				return null
		}
	}

	return (
		<div className="">
			{initialNotifications.length > 0 ? (
				notifications.map((notif) => (
					<NotificationItem
						key={notif.id}
						{...notif}
						markAsRead={markAsRead}
						nodeMessage={renderMessage(notif)}
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
