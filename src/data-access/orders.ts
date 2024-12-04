import { db } from "@/lib/db"
import { OrderStatus } from "@prisma/client"

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

export const getTotalRevenueByDate = async (date: Date) => {
	return await db.order.aggregate({
		where: {
			createdAt: {
				gte: date
			}
		},
		_sum: {
			totalPrice: true
		}
	})
}

export const getRecentOrders = async () => {
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
		},
		take: 10
	})
}

export const getFarmerOrders = async (filter: {
	status: OrderStatus | null
	search: string | null
	userId: string
}) => {
	return await db.order.findMany({
		where: {
			farmer: {
				userId: filter.userId
			},
			...(filter.status && { status: filter.status }),
			...(filter.search && {
				OR: [
					{
						product: { title: { contains: filter.search, mode: "insensitive" } }
					},
					{
						customer: {
							user: { name: { contains: filter.search, mode: "insensitive" } }
						}
					}
				]
			})
		},
		include: {
			product: {
				include: {
					images: true
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
			farmer: {
				include: {
					user: {
						select: {
							name: true
						}
					}
				}
			}
		}
	})
}
