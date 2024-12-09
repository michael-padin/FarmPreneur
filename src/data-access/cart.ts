import { db } from "@/lib/db"

export const getCartById = async (id: string) => {
	return await db.cart.findUnique({
		where: { id },
		include: {
			items: {
				include: {
					product: {
						include: {
							images: true,
							farmer: {
								select: {
									farmName: true,
									id: true
								}
							},
							pickupLocation: {
								select: {
									id: true,
									fullAddress: true,
									latitude: true,
									longitude: true
								}
							}
						}
					}
				}
			}
		}
	})
}
