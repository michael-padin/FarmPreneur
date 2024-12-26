import { auth } from "@/auth"
import {
	getCustomerOrders,
	getCustomerOrderStatuses,
	getFarmerOrders,
	getRecentOrders,
	getTotalOrders,
	getTotalOrdersByDate
} from "@/data-access/orders"
import { db } from "@/lib/db"
import { OrderStatus } from "@prisma/client"

export const getTotalOrdersUseCase = async () => {
	const currentDate = new Date()
	const lastMonthDate = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth() - 1,
		1
	)
	try {
		const totalOrders = await getTotalOrders()
		const increaseChange =
			totalOrders - (await getTotalOrdersByDate(lastMonthDate))
		return { totalOrders, increaseChange }
	} catch (error) {
		throw error
	}
}

export const getFarmerOrdersUseCase = async (filter: {
	status?: OrderStatus | null
	search?: string | null
}) => {
	const session = await auth()
	if (!session || !session.user) throw new Error("Unauthorized")

	return await getFarmerOrders({ ...filter, userId: session.user.id })
}

export const getCustomerOrdersUseCase = async (filter: {
	status?: OrderStatus | null
	search?: string | null
}) => {
	const session = await auth()
	if (!session || !session.user) throw new Error("Unauthorized")

	const customerId = session.user.customerId || ""

	if (!customerId) throw new Error("Customer not found")

	return await getCustomerOrders({
		...filter,
		customerId
	})
}

export const getFarmerOrderCountUseCase = async () => {
	const session = await auth()
	if (!session || !session.user) throw new Error("Unauthorized")

	const userId = session.user.id
	const orders = await db.order.findMany({
		where: {
			farmer: {
				userId
			}
		},
		select: {
			status: true
		}
	})

	const orderCounts = orders.reduce(
		(counts, order) => {
			counts[order.status] = (counts[order.status] || 0) + 1
			return counts
		},
		{ PENDING: 0, COMPLETED: 0, IN_PROGRESS: 0, CANCELLED: 0 }
	)

	return {
		pendingOrders: orderCounts.PENDING,
		completedOrders: orderCounts.COMPLETED,
		inProgressOrders: orderCounts.IN_PROGRESS,
		cancelledOrders: orderCounts.CANCELLED
	}
}
export const getCustomerOrderCountUseCase = async () => {
	try {
		const session = await auth()
		if (!session || !session.user) throw new Error("Unauthorized")

		const customerId = session.user.customerId || ""
		const orders = await getCustomerOrderStatuses(customerId)

		const orderCounts = orders.reduce(
			(counts, order) => {
				counts[order.status] = (counts[order.status] || 0) + 1
				return counts
			},
			{ PENDING: 0, COMPLETED: 0, IN_PROGRESS: 0, CANCELLED: 0 }
		)

		return {
			pendingOrders: orderCounts.PENDING,
			completedOrders: orderCounts.COMPLETED,
			inProgressOrders: orderCounts.IN_PROGRESS,
			cancelledOrders: orderCounts.CANCELLED
		}
	} catch (error) {
		throw error
	}
}

export const getRecentOrdersUseCase = async () => {
	try {
		return await getRecentOrders()
	} catch (error) {
		throw error
	}
}

export const getCustomerUnReviewedOrderUseCase = async (filter: {
	orderId?: string
}) => {
	try {
		const session = await auth()
		if (!session || !session.user) throw new Error("Unauthorized")

		const customerId = session.user.customerId || ""

		if (!customerId) throw new Error("Customer not found")

		const order = await db.order.findFirst({
			where: {
				id: filter.orderId
			},
			include: {
				items: {
					select: {
						product: {
							select: {
								id: true,
								price: true,
								unit: true,
								title: true,
								quantity: true,
								productImages: true
							}
						}
					}
				},
				farmer: {
					select: {
						farmName: true,
						contactNumber: true,
						profilePicture: true,
						address: {
							select: {
								fullAddress: true,
								latitude: true,
								longitude: true
							}
						}
					}
				}
			}
		})

		if (!order) throw new Error("Order not found")

		const shapedOrderItems = order.items.map((item) => ({
			productId: item.product.id,
			quantity: item.product.price,
			price: item.product.price,
			image: item.product.productImages[0],
			name: item.product.title,
			unit: item.product.unit || "kg"
		}))
		return {
			orderId: filter.orderId,
			items: shapedOrderItems,
			farmer: {
				contactNumber: order.farmer?.contactNumber || "",
				profilePicture: order.farmer?.profilePicture || "",
				farmName: order.farmer?.farmName || "",
				address: {
					fullAddress: order.farmer.address[0].fullAddress || "",
					longitude: order.farmer.address[0].longitude,
					latitude: order.farmer.address[0].latitude
				}
			}
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}
