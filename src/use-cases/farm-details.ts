import { FarmRegistrationSchema } from "@/app/(auth)/(farmer)/farmer-registration/types"
import {
	createFarmDetailsByFarmerId,
	getFarmDetailsById,
	getFarmDetailsByUserId
} from "@/data-access/farm-details"

export const getFarmDetailsByIdUseCase = async (id: string) => {
	return await getFarmDetailsById(id)
}
export const getFarmDetailsByUserIdUseCase = async (userId: string) => {
	return await getFarmDetailsByUserId(userId)
}

export const createFarmDetailsByFarmerIdUseCase = async (
	data: FarmRegistrationSchema & { farmerId: string }
) => {
	return createFarmDetailsByFarmerId(data)
}
