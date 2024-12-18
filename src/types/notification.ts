import {
	NotificationType,
	OrderStatus,
	OrderSubStatus,
	Notification as PrismaNotification,
	ProductListingStatus
} from "@prisma/client"

export { NotificationType }

export type NotifMetadata = {
	product?: {
		productId?: string
		productImage?: string
		productName?: string
		productListingStatus?: ProductListingStatus
	}
	farmer?: {
		farmerId?: string
		farmerName?: string
	}
	user?: {
		userId?: string
		name?: string
	}
	order?: {
		orderId?: string
		orderStatus?: OrderStatus
		orderSubStatus?: OrderSubStatus
		orderTotalPrice?: number
		orderItems?: {
			productId?: string
			productName?: string
			quantity?: number
			price?: number
		}[]
	}
}

export interface Notification extends PrismaNotification {
	metadata: NotifMetadata
}

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
