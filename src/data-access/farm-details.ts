import { SetupFarmInfoType } from "@/app/dashboard/farmer/setup-farm-info/validations"
import { db } from "@/lib/db"
import { create } from "domain"

export const getFarmDetailsById = async (id: string) => {
	return await db.farmDetails.findUnique({
		where: {
			id: id
		},
		select: {
			id: true,
			farmDescription: true,
			address: true,
			products: true,
			createdAt: true,
			updatedAt: true,
			farmerId: true,
			images: true,
			farmName: true
		}
	})
}

export const getFarmDetailsByUserId = async (userId: string) => {
	return await db.farmDetails.findFirst({
		where: {
			farmerId: userId
		},
		select: {
			id: true,
			farmDescription: true,
			address: true,
			products: true,
			createdAt: true,
			updatedAt: true,
			farmerId: true,
			images: {
				select: {
					id: true,
					url: true,
					filename: true,
					size: true,
					mimeType: true
				}
			},
			farmName: true
		}
	})
}

export const createFarmDetailsByUserId = async (
	data: SetupFarmInfoType & { userId: string }
) => {
	return await db.farmDetails.create({
		data: {
			farmName: data.farmName,
			farmDescription: data.farmDescription,
			farmerId: data.userId
		}
	})
}
