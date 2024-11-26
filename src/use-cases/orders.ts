import { auth } from "@/auth"
import {
	getOrders,
	getRecentOrders,
	getTotalOrders,
	getTotalOrdersByDate
} from "@/data-access/orders"

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

export const getRecentOrdersUseCase = async () => {
	try {
		return await getRecentOrders()
	} catch (error) {
		throw error
	}
}
