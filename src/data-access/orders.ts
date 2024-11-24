import { db } from "@/lib/db"

export const getOrders = async () => {
	return await db.order.findMany({
		orderBy: {
			createdAt: "desc"
		},
		include: {
			product: {
				include: {
					images: true
				}
			},
			farmer: {
				include: {
					user: {
						select: {
							name: true
						}
					}
				}
			},
			customer: {
				include: {
					user: {
						select: {
							name: true
						}
					}
				}
			},
			address: true
		}
	})
}

export const getTotalOrders = async () => {
	return await db.order.count()
}
export const getTotalOrdersByDate = async (date: Date) => {
	return await db.order.count({
		where: {
			createdAt: {
				gte: date
			}
		}
	})
}
