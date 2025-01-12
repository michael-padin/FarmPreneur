import { NotificationType } from "@prisma/client"
import {
	Bell,
	Box,
	HelpCircle,
	Megaphone,
	MessageSquare,
	ShieldCheck,
	ShoppingBag,
	UserCheck
} from "lucide-react"

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
			return <ShoppingBag {...iconProps} aria-label="Order Status" />
		case NotificationType.FARMER_APPROVAL:
			return <UserCheck {...iconProps} aria-label="Farmer Approval" />
		case NotificationType.PRODUCT_APPROVAL:
			return <Box {...iconProps} aria-label="Product Approval" />
		case NotificationType.NEW_MESSAGE:
			return <MessageSquare {...iconProps} aria-label="New Message" />
		case NotificationType.NEW_PRODUCT:
			return <Box {...iconProps} aria-label="New Product" />
		case NotificationType.PROMOTION:
			return <Megaphone {...iconProps} aria-label="Promotion" />
		case NotificationType.SYSTEM_ALERT:
			return <Bell {...iconProps} aria-label="System Alert" />
		case NotificationType.VERIFICATION:
			return <ShieldCheck {...iconProps} aria-label="Verification" />
		default:
			return (
				<HelpCircle {...iconProps} aria-label="Unknown Notification Type" />
			)
	}
}
