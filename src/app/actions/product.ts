"use server"
import { verifySession } from "@/lib/dal"
import { db } from "@/lib/db"
import { getErrorMessage } from "@/lib/handle-error"
import { ProductListingStatus } from "@prisma/client"

export const unlistProduct = async ({
	productId,
	status
}: {
	productId: string
	status: ProductListingStatus
}) => {
	await verifySession()
	try {
		await db.product.update({
			where: {
				id: productId
			},
			data: {
				listingStatus: status
			}
		})
		return { error: null }
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
}
