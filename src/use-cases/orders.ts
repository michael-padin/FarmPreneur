import { auth } from "@/auth"
import {
	getCustomerOrders,
	getCustomerOrderStatuses,
	getFarmerOrders,
	getOrders,
	getRecentOrders,
	getTotalOrders,
	getTotalOrdersByDate
} from "@/data-access/orders"
import { db } from "@/lib/db"
import { OrderStatus } from "@prisma/client"

export const getOrdersUseCase = async () => {
	const session = await auth()

	if (session?.user.role !== "ADMIN") {
		throw new Error("Unauthorized")
	}

	return await getOrders()
}

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
	status: OrderStatus | null
	search: string | null
}) => {
	const session = await auth()
	if (!session || !session.user) throw new Error("Unauthorized")

	return await getFarmerOrders({ ...filter, userId: session.user.id })
}

export const getCustomerOrdersUseCase = async (filter: {
	status: OrderStatus | null
	search: string | null
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

export const getCustomerOrderItemsUseCase = async (filter: {
	orderId?: string
	unrated?: boolean
}) => {
	try {
		const session = await auth()
		if (!session || !session.user) throw new Error("Unauthorized")

		const customerId = session.user.customerId || ""

		if (!customerId) throw new Error("Customer not found")

		const orderItems = await db.orderItem.findMany({
			where: {
				orderId: filter.orderId
			},
			include: {
				product: {
					select: {
						unit: true,
						title: true,
						images: {
							select: {
								url: true
							}
						},
						farmer: {
							select: {
								farmName: true
							}
						}
					}
				}
			}
		})

		if (!orderItems) throw new Error("Order not found")

		const shapedOrderItems = orderItems.map((item) => ({
			orderId: item.orderId,
			productId: item.productId,
			quantity: item.quantity,
			price: item.price,
			image: item.product.images[0].url,
			name: item.product.title,
			unit: item.product.unit || "kg",
			farmerName: item.product.farmer?.farmName || ""
		}))
		return shapedOrderItems
	} catch (error) {
		console.error(error)
		throw new Error("Failed to get order items")
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

		const orderItems = await db.orderItem.findMany({
			where: {
				orderId: filter.orderId,
				order: {
					AND: [
						{ subStatus: { not: "BUYER_REVIEWED" } },
						{ status: "COMPLETED" }
					]
				}
			},
			include: {
				product: {
					select: {
						unit: true,
						title: true,
						images: {
							select: {
								url: true
							}
						},
						farmer: {
							select: {
								farmName: true
							}
						}
					}
				}
			}
		})

		const shapedOrderItems = orderItems.map((item) => ({
			orderId: item.orderId,
			productId: item.productId,
			quantity: item.quantity,
			price: item.price,
			image: item.product.images[0].url,
			name: item.product.title,
			unit: item.product.unit || "kg",
			farmerName: item.product.farmer?.farmName || ""
		}))
		return shapedOrderItems
	} catch (error) {
		console.error(error)
		throw error
	}
}
