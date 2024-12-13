import { ProductListingStatus } from "@prisma/client"

export const PRODUCT_STATUS: Record<ProductListingStatus, string> = {
	[ProductListingStatus.PENDING]: "PENDING APPROVAL",
	[ProductListingStatus.APPROVED]: "APPROVED",
	[ProductListingStatus.REJECTED]: "REJECTED",
	[ProductListingStatus.EXPIRED]: "EXPIRED",
	[ProductListingStatus.PAUSED]: "PAUSED",
	[ProductListingStatus.OUT_OF_STOCK]: "OUT OF STOCK"
}
