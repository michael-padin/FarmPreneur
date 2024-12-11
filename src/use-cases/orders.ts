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
