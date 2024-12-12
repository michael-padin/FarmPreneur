import { type SubTrackStatus } from "@prisma/client"

export const subStatusMap: Record<
	SubTrackStatus,
	{ value: string; label: string }
> = {
	// New/Created statuses
	AWAITING_FARMER_ACCEPTANCE: {
		value: "AWAITING_FARMER_ACCEPTANCE",
		label: "Awaiting Farmer Acceptance"
	},

	// Active/In Progress statuses
	PREPARING_PRODUCE: {
		value: "PREPARING_PRODUCE",
		label: "Preparing Produce"
	},
	READY_FOR_PICKUP: { value: "READY_FOR_PICKUP", label: "Ready for Pickup" },

	// Completed statuses
	PICKED_UP: { value: "PICKED_UP", label: "Picked Up" },
	PAYMENT_PROCESSED: {
		value: "PAYMENT_PROCESSED",
		label: "Payment Processed"
	},
	BUYER_CONFIRMED: { value: "BUYER_CONFIRMED", label: "Buyer Confirmed" },
	FULLY_SETTLED: { value: "FULLY_SETTLED", label: "Fully Settled" },

	// Cancelled statuses
	CANCELLED_BY_FARMER: {
		value: "CANCELLED_BY_FARMER",
		label: "Cancelled by Farmer"
	},
	CANCELLED_BY_BUYER: {
		value: "CANCELLED_BY_BUYER",
		label: "Cancelled by Buyer"
	},
	INSUFFICIENT_STOCK: {
		value: "INSUFFICIENT_STOCK",
		label: "Insufficient Stock"
	},
	PAYMENT_FAILED: { value: "PAYMENT_FAILED", label: "Payment Failed" },
	QUALITY_ISSUES: { value: "QUALITY_ISSUES", label: "Quality Issues" }
}
