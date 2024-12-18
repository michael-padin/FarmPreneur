import { EditUserSchema } from "@/app/dashboard/(admin)/users/[id]/edit/validations"
import { db } from "@/lib/db"

export const getCustomerById = async (id: string) => {
	return await db.customer.findUnique({
		where: {
			id
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

		const customer = await tx.customer.upsert({
			where: {
				userId: data.userId
			},
			create: {
				userId: data.userId
			},
			update: {
				contactNumber: data.customer?.contactNumber
			}
		})
	})
}
