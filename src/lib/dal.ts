import { auth } from "@/auth"
import { ROLE } from "@prisma/client"
import { cache } from "react"
import "server-only"

const validateSession = async () => {
	const session = await auth()
	if (!session || !session.user) {
		throw new Error("Unauthorized: No valid session found")
	}
	return session.user
}

const validateUserRole = (userRole: string, requiredRole: string) => {
	if (userRole !== requiredRole) {
		throw new Error(`Unauthorized: Requires ${requiredRole} role`)
	}
}

export const verifySession = cache(async () => {
	const user = await validateSession()
	return { isAuth: true, userId: user.id, role: user.role }
})

export const verifyAdminSession = cache(async () => {
	const user = await validateSession()
	validateUserRole(user.role, ROLE.ADMIN)
	return { isAuth: true, userId: user.id }
})

export const verifyCustomerSession = cache(async () => {
	const user = await validateSession()
	validateUserRole(user.role, ROLE.CUSTOMER)

	if (!user.cartId || !user.customerId) {
		throw new Error("Invalid customer session: Missing cartId or customerId")
	}

	return {
		isAuth: true,
		userId: user.id,
		cartId: user.cartId,
		customerId: user.customerId
	}
})

export const verifyFarmerSession = cache(async () => {
	const user = await validateSession()
	validateUserRole(user.role, ROLE.FARMER)

	if (!user.farmerId) {
		throw new Error("Invalid farmer session: Missing farmerId")
	}

	return {
		isAuth: true,
		userId: user.id,
		farmerId: user.farmerId
	}
})
