"use client"

import { NotificationItem } from "@/app/_components/notification-item"
import { useNotifications } from "@/contexts/notification-context"
import { Notification } from "@/types/notification"
import { getNotificationsByUserIdUseCase } from "@/use-cases/notifications"
import { NotificationType } from "@prisma/client"
import { Bell, CircleCheckBig } from "lucide-react"
import Link from "next/link"
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

	const renderMessage = (notif: Notification) => {
		switch (notif.type) {
			case NotificationType.ORDER_STATUS:
				// Approved Product Listing Notification
				if (notif.metadata.order?.orderStatus === "IN_PROGRESS") {
					// Ready for Pickup Notification
					if (notif.metadata.order?.orderSubStatus === "READY_FOR_PICKUP") {
						return (
							<button
								onClick={() => markAsRead(notif.id)}
								className="text-left"
							>
								<Link href={`/orders?status=IN_PROGRESS`}>
									<div className="mb-2 space-y-1">
										<p className="text-sm">
											Your order{" "}
											<span className="capitalize text-primary">
												{notif.metadata.order?.orderItems
													?.map((item) => item.productName)
													.join(", ")}
											</span>{" "}
											has been{" "}
											<span className="text-primary">ready for pickup</span>.
										</p>
									</div>
								</Link>
							</button>
						)
					}
					if (notif.metadata.order?.orderSubStatus === "PICKED_UP") {
						return (
							<button
								onClick={() => markAsRead(notif.id)}
								className="text-left"
							>
								<Link href={`/orders?status=IN_PROGRESS`}>
									<div className="mb-2 space-y-1">
										<p className="text-sm">
											You have picked up your order{" "}
											<span className="capitalize text-primary">
												{notif.metadata.order?.orderItems
													?.map((item) => item.productName)
													.join(", ")}
											</span>{" "}
											from{" "}
											<span className="capitalize text-primary">
												{notif.metadata.farmer?.farmerName}
											</span>
											. Please confirm your order.
										</p>
									</div>
								</Link>
							</button>
						)
					}

					return (
						<button onClick={() => markAsRead(notif.id)} className="text-left">
							<Link href={`/orders?status=IN_PROGRESS`}>
								<div className="mb-2 space-y-1">
									<p className="text-sm">
										Your order{" "}
										<span className="capitalize text-primary">
											{notif.metadata.order?.orderItems
												?.map((item) => item.productName)
												.join(", ")}
										</span>{" "}
										has been <span className="text-primary">accepted</span>
									</p>
								</div>
							</Link>
						</button>
					)
				}

				// Cancelled Order Notification
				if (notif.metadata.order?.orderStatus === "CANCELLED") {
					return (
						<button onClick={() => markAsRead(notif.id)} className="text-left">
							<div className="mb-2 space-y-1">
								<p className="text-sm">
									Your order{" "}
									<span className="capitalize text-primary">
										{notif.metadata.order?.orderItems
											?.map((item) => item.productName)
											.join(", ")}
									</span>{" "}
									has been <span className="text-destructive">cancelled</span>
								</p>
							</div>
						</button>
					)
				}

				return null

			case NotificationType.NEW_MESSAGE:
				return null

			default:
				return null
		}
	}

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
