import { setupFarmInfo } from "@/app/dashboard/farmer/setup-farm-info/actions"
import { SetupFarmInfoType } from "@/app/dashboard/farmer/setup-farm-info/validations"
import {
	createFarmDetailsByUserId,
	getFarmDetailsById,
	getFarmDetailsByUserId
} from "@/data-access/farm-details"

export const getFarmDetailsByIdUseCase = async (id: string) => {
	return await getFarmDetailsById(id)
}
export const getFarmDetailsByUserIdUseCase = async (userId: string) => {
	return await getFarmDetailsByUserId(userId)
}

export const createFarmDetailsByUserIdUseCase = async (
	data: SetupFarmInfoType & { userId: string }
) => {
	return createFarmDetailsByUserId({ ...data })
}
