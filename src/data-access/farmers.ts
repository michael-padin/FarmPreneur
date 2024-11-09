import { FarmRegistrationSchema } from "@/app/(auth)/(farmer)/farmer-registration/types"
import { db } from "@/lib/db"

export const createFarmer = async () => {}

export const createFarmerByUserId = async (
	data: FarmRegistrationSchema & { userId: string }
) => {
	return await db.farmer.create({
		data: {
			applicationStatus: "PENDING",
			userId: data.userId,
			contactNumber: data.contactNumber,
			birthDate: new Date(data.birthDate),
			farmName: data.farmName,
			farmDescription: data.farmDescription
		}
	})
}

export const getFarmerByUserId = async (userId: string) => {
	return await db.farmer.findUnique({
		where: {
			userId: userId
		},
		select: {
			id: true,
			birthDate: true,
			applicationStatus: true,
			contactNumber: true,
			farmName: true,
			farmDescription: true,
			userId: true,
			createdAt: true,
			updatedAt: true,
			address: true,
			orders: true,
			reviews: true,
			verificationDocument: {
				select: {
					image: true,
					type: true
				}
			},
			products: true,
			user: {
				select: {
					emailVerified: true,
					id: true,
					name: true,
					email: true,
					role: true,
					isEmailVerified: true,
					createdAt: true,
					image: true,
					updatedAt: true
				}
			}
		}
	})
}

export const getFarmerById = async () => {}

export const getFarmers = async () => {
	return await db.farmer.findMany({
		select: {
			id: true,
			birthDate: true,
			applicationStatus: true,
			contactNumber: true,
			farmName: true,
			farmDescription: true,
			userId: true,
			createdAt: true,
			updatedAt: true,
			_count: true,
			address: true,
			orders: true,
			reviews: true,
			verificationDocument: true,
			products: true,
			user: {
				select: {
					emailVerified: true,
					id: true,
					name: true,
					email: true,
					role: true,
					isEmailVerified: true,
					createdAt: true,
					image: true,
					updatedAt: true,
					_count: true
				}
			}
		},
		orderBy: {
			createdAt: "desc"
		}
	})
}

export const getPendingFarmers = async () => {
	return await db.farmer.findMany({
		where: {
			AND: [{ user: { role: "FARMER" } }, { applicationStatus: "PENDING" }]
		},
		include: {
			user: {
				select: {
					id: true,
					createdAt: true,
					updatedAt: true,
					name: true,
					email: true,
					role: true,
					profilePicture: true,
					isEmailVerified: true,
					emailVerified: true
				}
			},
			address: true,
			orders: true,
			reviews: true,
			verificationDocument: {
				include: {
					image: true
				}
			}
		},
		orderBy: {
			createdAt: "desc"
		}
	})
}

export const getFarmerApprovalStatusByUserId = async (id: string) => {
	return db.farmer.findUnique({
		where: {
			userId: id
		},
		select: {
			applicationStatus: true
		}
	})
}
