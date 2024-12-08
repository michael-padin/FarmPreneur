import { db } from "@/lib/db"

export const getCart = async (customerId: string) => {
	return await db.cartItem.findMany({
		where: { customerId },
		include: {
			product: {
				include: {
					images: true,
					farmer: {
						select: {
							farmName: true,
							id: true
						}
					}
				}
			}
		}
	})
}
