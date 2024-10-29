import {
	getFarmerDetailsById,
	getFarmerDetailsByUserId
} from "@/data-access/farm-details"

export const getFarmerDetailsByIdUseCase = async (id: string) => {
	return await getFarmerDetailsById(id)
}
export const getFarmerDetailsByUserIdUseCase = async (id: string) => {
	return await getFarmerDetailsByUserId(id)
}
