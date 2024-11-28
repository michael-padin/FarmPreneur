import {
	NotificationType,
	Notification as PrismaNotification
} from "@prisma/client"

export { NotificationType }

type NotifMetadata = {
	orderId?: string
	farmerId?: string
	userId?: string
}

export interface Notification extends PrismaNotification {
	metadata: NotifMetadata
}

export const notificationLabels: Record<NotificationType, string> = {
	FARMER_APPROVAL: "Farmer Approval",
	PRODUCT_APPROVAL: "Product Approval",
	NEW_PRODUCT: "New Product",
	NEW_MESSAGE: "New Message",
	ORDER_STATUS: "Order Status",
	PROMOTION: "Promotion",
	SYSTEM_ALERT: "System Alert",
	VERIFICATION: "Verification"
}
export const notificationOptions = Object.entries(notificationLabels).map(
	([value, label]) => ({
		label,
		value
	})
)
