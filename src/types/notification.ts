import { NotificationType } from "@prisma/client"

export { NotificationType }

export const notificationTypeMap: Record<NotificationType, string> = {
	FARMER_APPROVAL: "Farmer Approval",
	PRODUCT_APPROVAL: "Product Approval",
	NEW_PRODUCT: "New Product",
	NEW_MESSAGE: "New Message",
	ORDER_STATUS: "Order Status",
	PROMOTION: "Promotion",
	SYSTEM_ALERT: "System Alert",
	VERIFICATION: "Verification"
}
export const notificationOptions = Object.entries(notificationTypeMap).map(
	([value, label]) => ({
		label,
		value
	})
)
