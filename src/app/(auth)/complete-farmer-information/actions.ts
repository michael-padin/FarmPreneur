"use server"
import { getErrorMessage } from "@/lib/handle-error"
import { CompleteFarmerInformationType } from "./types"

export const createFarmerDetails = async (
	data: CompleteFarmerInformationType
) => {
	try {
		return { error: null }
	} catch (error) {
		console.log(error)
		return { error: getErrorMessage(error) }
	}
}
