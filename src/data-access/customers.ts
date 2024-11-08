import { db } from "@/lib/db"

export const createCustomer = async () => {}

export const createCustomerByUserId = async () => {}

export const getCustomerByUserId = async () => {}

export const getCustomerById = async () => {}

export const getCustomers = async () => {
	return await db.customer.findMany({
		select: {
			id: true,
			contactNumber: true,
			userId: true,
			createdAt: true,
			updatedAt: true,
			address: true,
			orders: true,
			cart: true,
			wishlist: true,
			reviews: true
		},
		orderBy: {
			createdAt: "desc"
		}
	})
}
