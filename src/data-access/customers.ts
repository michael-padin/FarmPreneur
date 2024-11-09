import { db } from "@/lib/db"

export const createCustomer = async () => {}

export const createCustomerByUserId = async () => {}

export const getCustomerByUserId = async () => {}

export const getCustomerById = async () => {}

export const getCustomers = async () => {
	return await db.customer.findMany({
		include: {
			user: {
				select: {
					name: true,
					email: true,
					role: true,
					isEmailVerified: true,
					createdAt: true,
					image: true,
					updatedAt: true,
					profilePicture: true,
					notifications: true
				}
			}
		},
		orderBy: {
			createdAt: "desc"
		}
	})
}
