import { NotificationType } from "@prisma/client"
import { Box, HelpCircle, MessageSquare } from "lucide-react"

interface NotificationIconProps {
	type: NotificationType
	size?: number
	className?: string
}

export function NotificationIcon({
	type,
	size = 24,
	className = ""
}: NotificationIconProps) {
	const iconProps = { size, className: `${className} text-primary` }

	switch (type) {
		case NotificationType.ORDER_STATUS:
			return <Box {...iconProps} aria-label="Product Approval" />
		case NotificationType.NEW_MESSAGE:
			return <MessageSquare {...iconProps} aria-label="New Message" />
		default:
			return (
				<HelpCircle {...iconProps} aria-label="Unknown Notification Type" />
			)
	}
}
