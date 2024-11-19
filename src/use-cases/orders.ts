import { auth } from "@/auth"
import { getOrders } from "@/data-access/orders"
import { getSession } from "next-auth/react"

export const getOrdersUseCase = async () => {
	const session = await auth()

	if (session?.user.role !== "ADMIN") {
		throw new Error("Unauthorized")
	}

	return await getOrders()
}
