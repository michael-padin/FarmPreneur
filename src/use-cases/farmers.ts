import { FarmRegistrationSchema } from "@/app/(auth)/(farmer)/farmer-registration/types"
import { EditUserSchema } from "@/app/dashboard/(admin)/users/[id]/edit/_components/validations"
import {
	createFarmerByUserId,
	getFarmerApprovalStatusByUserId,
	getFarmerByUserId,
	getFarmers,
	getPendingFarmers,
	updateFarmerByUserId
} from "@/data-access/farmers"

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
	return await getFarmerByUserId(id)
}

export const createFarmerByUserIdUseCase = async (
	data: FarmRegistrationSchema & { userId: string }
) => {
	return await createFarmerByUserId(data)
}

// MARK: MUTATIONS
export const updateFarmerByUserIdUseCase = async (
	data: EditUserSchema & {
		userId: string
	}
) => {
	return await updateFarmerByUserId(data)
}
