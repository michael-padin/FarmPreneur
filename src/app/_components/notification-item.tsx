import { Button } from "@/components/ui/button"
import { Notification } from "@prisma/client"
import { formatDistanceToNowStrict } from "date-fns"
import { X } from "lucide-react"
import Link from "next/link"

interface NotificationItemProps extends Notification {
	markAsRead: (id: string) => void
	Icon: React.ReactNode
	nodeMessage?: React.ReactNode
}

type Metadata = {
	url?: string
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
	const metadata = props.metadata as Metadata
	return (
		<Link href={metadata?.url || "#"}>
			<div
				className={`flex items-start gap-4 bg-background py-2 ${isRead ? "opacity-50" : ""} `}
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
		</Link>
	)
}
