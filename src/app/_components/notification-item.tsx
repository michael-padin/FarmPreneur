"use client"
import { Button } from "@/components/ui/button"
import { NotificationMetadata } from "@/types/notification"
import { Notification } from "@prisma/client"
import { formatDistanceToNowStrict } from "date-fns"
import { X } from "lucide-react"
import Link from "next/link"
import { useActionState } from "react"
import { readNotification } from "../actions/notifications"

interface NotificationItemProps extends Notification {
	markAsRead: (id: string) => void
	Icon: React.ReactNode
	nodeMessage?: React.ReactNode
}

export function NotificationItem({
	id,
	title,
	message,
	nodeMessage,
	createdAt,
	isRead,
	markAsRead,
	Icon,
	...props
}: NotificationItemProps) {
	const [, formAction] = useActionState(readNotification, null)
	const actionWithNotificationId = formAction.bind(null, id)
	const metadata = props.metadata as NotificationMetadata
	return (
		<div
			className={`flex w-full items-start gap-2 p-2 px-4 ${!isRead ? "bg-green-50" : ""}`}
		>
			<Link href={metadata?.url || "#"} className="w-full">
				<div
					className={`flex items-start gap-4 py-2 ${isRead ? "opacity-50" : ""} `}
				>
					{Icon}
					<div className="flex-1 space-y-1">
						<div className="flex items-center gap-2">
							<p className="font-medium">{title}</p>
							{!isRead && (
								<span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
							)}
						</div>
						{nodeMessage || (
							<p className="text-sm text-muted-foreground">{message}</p>
						)}
						{createdAt && (
							<p className="text-xs text-muted-foreground">
								{`${formatDistanceToNowStrict(new Date(createdAt), {
									addSuffix: true
								})}`}
							</p>
						)}
					</div>
				</div>
			</Link>
			{!isRead && (
				<form
					action={async () => {
						markAsRead(id)
						actionWithNotificationId()
					}}
				>
					<Button variant="ghost" size="icon" className="h-8 w-8">
						<X className="h-4 w-4" />
						<span className="sr-only">Mark as read</span>
					</Button>
				</form>
			)}
		</div>
	)
}
