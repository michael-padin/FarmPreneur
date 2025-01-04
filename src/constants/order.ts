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
	[OrderSubStatus.CANCELLED_BY_FARMER]: { label: "CANCELLED BY FARMER" },
	[OrderSubStatus.CANCELLED_BY_BUYER]: { label: "CANCELLED BY BUYER" },
	[OrderSubStatus.INSUFFICIENT_STOCK]: { label: "INSUFFICIENT STOCK" },
	[OrderSubStatus.PAYMENT_FAILED]: { label: "PAYMENT FAILED" },
	[OrderSubStatus.QUALITY_ISSUES]: { label: "QUALITY ISSUES" },
	[OrderSubStatus.ORDER_EXPIRED]: { label: "ORDER EXPIRED" },
	[OrderSubStatus.NO_SHOW_AT_PICKUP]: { label: "NO SHOW AT PICKUP" },
	[OrderSubStatus.PICKUP_DELAYED]: { label: "PICKUP DELAYED" }
}
