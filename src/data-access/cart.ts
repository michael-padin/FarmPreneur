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
									profilePicture: true,
									farmName: true,
									id: true,
									contactNumber: true,
									address: {
										select: {
											id: true,
											fullAddress: true,
											longitude: true,
											latitude: true,
											note: true
										}
									}
								}
							}
						}
					}
				}
			}
		}
	})
}
