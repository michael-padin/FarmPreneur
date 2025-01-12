"use client"

import { NotificationItem } from "@/app/_components/notification-item"
import { readNotifications } from "@/app/actions/notifications"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/contexts/notification-context"
import { useActionState } from "react"
import { NotificationIcon } from "./notification-icon"

export const NotificationList = () => {
	const { readAllNotifications, readNotification, notifications } =
		useNotifications()
	const [, formAction] = useActionState(readNotifications, null)
	const readNotificationsAction = formAction.bind(null)
	return (
		<div className="mx-auto max-w-2xl rounded-lg bg-background lg:p-6">
			<div className="flex items-center justify-between pb-4">
				<h2 className="text-2xl font-semibold leading-none tracking-tight">
					Notifications
				</h2>

				<form
					action={async () => {
						readAllNotifications()
						await readNotificationsAction()
					}}
				>
					<Button variant="default" size="sm">
						Read all
					</Button>
				</form>
			</div>
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
