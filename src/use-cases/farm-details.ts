import { SetupFarmInformationSchema } from "@/app/(auth)/setup-farm-information/types"
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
	data: SetupFarmInformationSchema & { farmerId: string }
) => {
	return createFarmDetailsByFarmerId(data)
}
