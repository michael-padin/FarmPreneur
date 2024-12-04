"use server"
import { FarmRegistrationSchema } from "@/app/(auth)/(farmer)/farmer-registration/types"
import { EditUserSchema } from "@/app/dashboard/(admin)/users/[id]/edit/validations"
import { auth } from "@/auth"
import {
	createFarmerByUserId,
	getFarmerApprovalStatusByUserId,
	getFarmerByUserId,
	getFarmers,
	getPendingFarmers,
	getPendingFarmerCount,
	updateFarmerByUserId,
	getApprovedFarmers,
	getTopFarmers,
	getFarmerOwnProfile
} from "@/data-access/farmers"

export const getFarmerOwnProfileUseCase = async () => {
	const session = await auth()

	if (!session || !session.user.id) throw new Error("Unauthorized!")
	const farmer = await getFarmerOwnProfile(session.user.id)
	if (!farmer) throw new Error("Farmer not found!")

	const averageRating =
		farmer.reviews.reduce((sum, review) => sum + review.rating, 0) /
			farmer.reviews.length || 0

	return { ...farmer, averageRating }
}

export const getPendingFarmerCountUseCase = async () => {
	return await getPendingFarmerCount()
}

export const getApprovedFarmersUseCase = async () => {
	try {
		return await getApprovedFarmers()
	} catch (error) {
		console.log(error)
	}
}

export const getFarmersUseCase = async () => {
	return await getFarmers()
}
export const getPendingFarmersUseCase = async () => {
	return await getPendingFarmers()
}

export const getFarmerApprovalStatusByUserIdUseCase = async (id: string) => {
	return await getFarmerApprovalStatusByUserId(id)
}

export const getUserFarmerByIdUseCase = async (id: string) => {
	return await getFarmerByUserId(id)
}

export const getFarmerByUserIdUseCase = async (id: string) => {
	const farmer = await getFarmerByUserId(id)
	if (!farmer) throw new Error("Farmer not found!")
	return farmer
}

export const createFarmerByUserIdUseCase = async (
	data: FarmRegistrationSchema & { userId: string }
) => {
	return await createFarmerByUserId(data)
}

export const getTopFarmersUseCase = async () => {
	try {
		return await getTopFarmers()
	} catch (error) {
		console.log(error)
	}
}

// MARK: MUTATIONS
export const updateFarmerByUserIdUseCase = async (
	data: EditUserSchema & {
		userId: string
	}
) => {
	return await updateFarmerByUserId(data)
}
