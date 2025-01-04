import { OrderStatus, OrderSubStatus } from "@prisma/client"

export const orderStatusMap: Record<OrderStatus, string> = {
	[OrderStatus.PENDING]: "PENDING",
	[OrderStatus.IN_PROGRESS]: "IN PROGRESS",
	[OrderStatus.COMPLETED]: "COMPLETED",
	[OrderStatus.CANCELLED]: "CANCELLED"
}
export const orderSubStatusMap: Record<OrderSubStatus, { label: string }> = {
	[OrderSubStatus.ORDER_PLACED]: { label: "ORDER PLACED" },
	[OrderSubStatus.ORDER_ACCEPTED]: { label: "ORDER ACCEPTED" },
	[OrderSubStatus.ORDER_REJECTED]: { label: "ORDER REJECTED" },
	[OrderSubStatus.PREPARING_PRODUCE]: { label: "PREPARING PRODUCE" },
	[OrderSubStatus.PRODUCE_READY_FOR_PICKUP]: { label: "READY FOR PICKUP" },
	[OrderSubStatus.PICKED_UP_BY_BUYER]: { label: "PICKED UP" },
	[OrderSubStatus.PAYMENT_PENDING]: { label: "PAYMENT PENDING" },
	[OrderSubStatus.PAYMENT_PROCESSED]: { label: "PAYMENT PROCESSED" },
	[OrderSubStatus.BUYER_CONFIRMED_ORDER]: { label: "BUYER CONFIRMED" },
	[OrderSubStatus.BUYER_REVIEWED]: { label: "BUYER REVIEWED" },
	[OrderSubStatus.ORDER_COMPLETED]: { label: "ORDER COMPLETED" },
	[OrderSubStatus.FULLY_SETTLED]: { label: "FULLY SETTLED" },
	[OrderSubStatus.ORDER_CANCELLED]: { label: "ORDER CANCELLED" },
	[OrderSubStatus.INSUFFICIENT_STOCK]: { label: "INSUFFICIENT STOCK" },
	[OrderSubStatus.PAYMENT_FAILED]: { label: "PAYMENT FAILED" },
	[OrderSubStatus.QUALITY_ISSUES]: { label: "QUALITY ISSUES" },
	[OrderSubStatus.ORDER_EXPIRED]: { label: "ORDER EXPIRED" },
	[OrderSubStatus.NO_SHOW_AT_PICKUP]: { label: "NO SHOW AT PICKUP" },
	[OrderSubStatus.PICKUP_DELAYED]: { label: "PICKUP DELAYED" }
}

export const getStatusDescription = (
	status: OrderStatus,
	subStatus: OrderSubStatus,
	reason?: string
): string => {
	switch (subStatus) {
		case OrderSubStatus.ORDER_PLACED:
			return "Order has been placed successfully"
		case OrderSubStatus.ORDER_ACCEPTED:
			return "Order accepted by farmer"
		case OrderSubStatus.PREPARING_PRODUCE:
			return "Farmer is preparing the produce"
		case OrderSubStatus.PRODUCE_READY_FOR_PICKUP:
			return "Produce is ready for pickup"
		case OrderSubStatus.PICKED_UP_BY_BUYER:
			return "Order picked up by customer"
		case OrderSubStatus.PAYMENT_PENDING:
			return "Awaiting payment"
		case OrderSubStatus.PAYMENT_PROCESSED:
			return "Payment has been processed"
		case OrderSubStatus.BUYER_CONFIRMED_ORDER:
			return "Order confirmed by customer"
		case OrderSubStatus.BUYER_REVIEWED:
			return "Customer reviewed the order"
		case OrderSubStatus.ORDER_COMPLETED:
			return "Order completed"
		case OrderSubStatus.ORDER_REJECTED:
			return `Order rejected by farmer${reason ? `: ${reason}` : ""}`
		case OrderSubStatus.ORDER_CANCELLED:
			return `Order cancelled${reason ? `: ${reason}` : ""}`
		default:
			return `Order status updated to ${subStatus}`
	}
}

export const cancellationReasonMap = {
	[OrderSubStatus.INSUFFICIENT_STOCK]:
		"Order cancelled due to insufficient stock",
	[OrderSubStatus.PAYMENT_FAILED]: "Order cancelled due to payment failure",
	[OrderSubStatus.QUALITY_ISSUES]: "Order cancelled due to quality issues",
	[OrderSubStatus.NO_SHOW_AT_PICKUP]: "Customer did not show up for pickup",
	[OrderSubStatus.PICKUP_DELAYED]: "Pickup has been delayed"
}
