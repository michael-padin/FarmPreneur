"use client"

import { NotificationItem } from "@/app/_components/notification-item"
import { useNotifications } from "@/contexts/notification-context"
import { CircleCheckBig } from "lucide-react"
import { useActionState } from "react"
import { readNotifications } from "../actions/notifications"
import { NotificationIcon } from "./notification-icon"

export const NotificationList = () => {
	const { readAllNotifications, readNotification, notifications } =
		useNotifications()
	const [, formAction] = useActionState(readNotifications, null)
	const readNotificationsAction = formAction.bind(null)
	return (
		<div className="lg:container lg:mx-auto lg:rounded-lg lg:border lg:bg-card lg:p-6">
			<form
				action={async () => {
					readAllNotifications()
					await readNotificationsAction()
				}}
			>
				<div className="flex justify-end p-4">
					<button>
						<CircleCheckBig className="h-6 w-6 text-primary" />
						<span className="sr-only">Mark all as read</span>
					</button>
				</div>
			</form>

			<div className="">
				{notifications.map((notif) => (
					<NotificationItem
						key={notif.id}
						{...notif}
						markAsRead={readNotification}
						Icon={
							<div className="flex h-10 min-w-10 items-center justify-center rounded-full bg-primary/10">
								<NotificationIcon type={notif.type} className="h-5 w-5" />
							</div>
						}
					/>
				))}
			</div>
		</div>
	)
}
