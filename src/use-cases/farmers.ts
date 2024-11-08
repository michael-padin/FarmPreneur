import {
	getFarmerByUserId,
	getFarmers,
	getPendingFarmers
} from "@/data-access/farmers"
import { transformFarmerRecord } from "@/utils/transform"

export const getFarmersUseCase = async () => {
	const farmers = await getFarmers()
	return farmers.map(transformFarmerRecord)
}
export const getPendingFarmersUseCase = async () => {
	return await getPendingFarmers()
}

export const getUserFarmerByIdUseCase = async (id: string) => {
	return await getFarmerByUserId(id)
}
