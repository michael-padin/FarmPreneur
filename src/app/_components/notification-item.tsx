"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { NotificationMetadata } from "@/types/notification"
import { Notification } from "@prisma/client"
import { X } from "lucide-react"
import Link from "next/link"
import { useActionState } from "react"
import { readNotification } from "../actions/notifications"

interface NotificationItemProps extends Notification {
	markAsRead: (id: string) => void
	Icon: React.ReactNode
	nodeMessage?: React.ReactNode
	titleClassName?: string
	bodyClassName?: string
}

export function NotificationItem({
	id,
	title,
	titleClassName,
	bodyClassName,
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
			className={`flex w-full items-start gap-2 p-2 px-4 ${!isRead ? "bg-green-50" : ""} `}
		>
			<Link
				href={metadata?.url || "#"}
				className="w-full overflow-hidden break-words"
			>
				<div className={`flex items-start gap-4 ${isRead ? "" : ""} `}>
					{Icon}
					<div className="flex-1 break-words">
						<div className="flex items-center gap-2">
							<p className={cn("font-medium", titleClassName)}>{title}</p>
							{!isRead && (
								<span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
							)}
						</div>
						{nodeMessage || (
							<div
								className={cn(
									"break-words text-sm text-muted-foreground",
									bodyClassName
								)}
							>
								{message}
							</div>
						)}
						{createdAt && (
							<time className="mt-2 block text-xs font-normal leading-none text-muted-foreground">
								{new Date(createdAt).toLocaleString()}
							</time>
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
