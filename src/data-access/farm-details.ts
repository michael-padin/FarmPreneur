import { db } from "@/lib/db"

export const getFarmerDetailsById = async (id: string) => {
	return await db.farmerDetail.findUnique({
		where: {
			id: id
		},
		select: {
			id: true,
			farmDescription: true,
			address: true,
			products: true,
			applicationStatus: true,
			createdAt: true,
			updatedAt: true,
			farmerId: true,
			images: true,
			farmName: true
		}
	})
}

export const getFarmerDetailsByUserId = async (id: string) => {
	return await db.farmerDetail.findFirst({
		where: {
			farmerId: id
		},
		select: {
			id: true,
			farmDescription: true,
			address: true,
			products: true,
			applicationStatus: true,
			createdAt: true,
			updatedAt: true,
			farmerId: true,
			images: true,
			farmName: true
		}
	})
}
