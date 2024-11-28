import { Button } from "@/components/ui/button"
import { Notification } from "@prisma/client"
import { formatDistanceToNowStrict } from "date-fns"
import { X } from "lucide-react"

interface NotificationItemProps extends Notification {
	markAsRead: (id: string) => void
	Icon: React.ReactNode
}

export function NotificationItem({
	id,
	title,
	message,
	createdAt,
	isRead,
	markAsRead,
	Icon
}: NotificationItemProps) {
	return (
		<div
			className={`flex items-start gap-4 py-2 ${isRead ? "opacity-50" : ""} `}
		>
			{Icon}
			<div className="flex-1 space-y-1">
				<div className="flex items-center gap-2">
					<p className="text-sm font-medium">{title}</p>
					{!isRead && (
						<span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
					)}
				</div>
				<p className="text-sm text-muted-foreground">{message}</p>
				<p className="text-xs text-muted-foreground">
					{formatDistanceToNowStrict(createdAt, { addSuffix: true })}
				</p>
			</div>
			{!isRead && (
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8"
					onClick={() => markAsRead(id)}
				>
					<X className="h-4 w-4" />
					<span className="sr-only">Mark as read</span>
				</Button>
			)}
		</div>
	)
}
