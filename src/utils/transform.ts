import { getCustomers } from "@/data-access/users"

export function transformCustomerRecord(
	user: Awaited<ReturnType<typeof getCustomers>>[0]
) {
	const orders = user.buyerOrders
	const totalSpend = orders.reduce((sum: number, order) => {
		return sum + (order.status !== "CANCELLED" ? order.totalPrice : 0)
	}, 0)
	const lastOrderDate = orders.length > 0 ? orders[0].createdAt : null
	const isActive = lastOrderDate
		? new Date().getTime() - lastOrderDate.getTime() < 30 * 24 * 60 * 60 * 1000
		: false

	return {
		...user,
		lastOrderDate,
		orderCount: orders.length,
		totalSpend,
		status: isActive ? "Active" : "Inactive"
	}
}
