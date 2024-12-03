"use server"

import {
	getFarmersUseCase,
	getPendingFarmerCountUseCase
} from "@/use-cases/farmers"

export const getPendingFarmerCount = async () => {
	return await getPendingFarmerCountUseCase()
}

export const getFarmers = async () => {
	return await getFarmersUseCase()
}
