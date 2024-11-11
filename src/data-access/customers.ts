import { EditUserSchema } from "@/app/dashboard/(admin)/users/[id]/edit/_components/validations"
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

// MARK: MUTATIONS
export const updateCustomerByUserId = async (
	data: EditUserSchema & {
		userId: string
	}
) => {
	return await db.$transaction(async (tx) => {
		await tx.user.update({
			where: {
				id: data.userId
			},
			data: {
				name: data.name,
				email: data.email as string,
				isEmailVerified: data.isEmailVerified,
				role: data.role,
				...(data.password && { password: data.password })
			}
		})
		let customerId
		if (data.customer) {
			const customer = await tx.customer.upsert({
				where: {
					userId: data.userId
				},
				create: {
					userId: data.userId
				},
				update: {
					contactNumber: data.customer.contactNumber
				},
				select: {
					id: true
				}
			})
			customerId = customer.id
		}

		if (data.customer && data.customer.address) {
			await tx.address.upsert({
				where: {
					customerId: customerId
				},
				create: {
					customerId: customerId,
					fullAddress: data.customer.address.fullAddress,
					street: data.customer.address.street,
					region: data.customer.address.region,
					country: data.customer.address.country,
					postalCode: data.customer.address.postalCode,
					latitude: data.customer.address.latitude,
					longitude: data.customer.address.longitude
				},
				update: {
					street: data.customer.address.street,
					region: data.customer.address.region,
					country: data.customer.address.country,
					postalCode: data.customer.address.postalCode,
					latitude: data.customer.address.latitude,
					longitude: data.customer.address.longitude
				}
			})
		}
	})
}
