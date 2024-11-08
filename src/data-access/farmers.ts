import { db } from "@/lib/db"

export const createFarmer = async () => {}

export const createFarmerByUserId = async () => {
	return await db.farmer.create({
		data: {
			contactNumber: "123456789",
			userId: "123456789",
			applicationStatus: "PENDING",
			birthDate: new Date(),
			farmName: "Farm Name",
			farmDescription: "Farm Description",
			address: {
				create: {
					fullAddress: "1234 Main Street",
					street: "Main Street",
					region: "Region",
					country: "Country",
					postalCode: "12345",
					latitude: 12.34,
					longitude: 12.34
				}
			}
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
			verificationDocument: true,
			verificationDocumentId: true,
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
			verificationDocumentId: true,
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
			applicationStatus: "PENDING"
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
			_count: true,
			address: true,
			orders: true,
			reviews: true,
			verificationDocument: true,
			verificationDocumentId: true,
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
