import { OrderStatus, OrderSubStatus } from "@prisma/client"

export const orderStatusMap: Record<OrderStatus, string> = {
	[OrderStatus.PENDING]: "PENDING",
	[OrderStatus.IN_PROGRESS]: "IN PROGRESS",
	[OrderStatus.COMPLETED]: "COMPLETED",
	[OrderStatus.CANCELLED]: "CANCELLED"
}

export const orderSubStatusMap: Record<OrderSubStatus, { label: string }> = {
	[OrderSubStatus.AWAITING_FARMER_ACCEPTANCE]: {
		label: "AWAITING FARMER ACCEPTANCE"
	},
	[OrderSubStatus.PREPARING_PRODUCE]: { label: "PREPARING PRODUCE" },
	[OrderSubStatus.READY_FOR_PICKUP]: { label: "READY FOR PICKUP" },
	[OrderSubStatus.PICKED_UP]: { label: "PICKED UP" },
	[OrderSubStatus.PAYMENT_PROCESSED]: { label: "PAYMENT PROCESSED" },
	[OrderSubStatus.BUYER_CONFIRMED]: { label: "BUYER CONFIRMED" },
	[OrderSubStatus.BUYER_REVIEWED]: { label: "BUYER REVIEWED" },
	[OrderSubStatus.FULLY_SETTLED]: { label: "FULLY SETTLED" },
	[OrderSubStatus.CANCELLED_BY_FARMER]: { label: "CANCELLED BY FARMER" },
	[OrderSubStatus.CANCELLED_BY_BUYER]: { label: "CANCELLED BY BUYER" },
	[OrderSubStatus.INSUFFICIENT_STOCK]: { label: "INSUFFICIENT STOCK" },
	[OrderSubStatus.PAYMENT_FAILED]: { label: "PAYMENT FAILED" },
	[OrderSubStatus.QUALITY_ISSUES]: { label: "QUALITY ISSUES" }
}
