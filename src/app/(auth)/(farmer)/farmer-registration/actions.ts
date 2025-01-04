"use server"
import { notifyAdminNewFarmerRegistration } from "@/app/actions/notifications"
import { getErrorMessage } from "@/lib/handle-error"
import { createUserFarmerByIdUseCase } from "@/use-cases/users"
import { FarmRegistrationSchema } from "./types"

export const upsertFarmerAction = async (
	data: FarmRegistrationSchema & {
		userId: string
		newGovIdImage?: string
		newSelfieWithGovIdImage?: string
	}
) => {
	try {
		const createdFarmer = await createUserFarmerByIdUseCase({
			...data
		})

		if (!createdFarmer) {
			return { error: "Failed to create farmer" }
		}

		await notifyAdminNewFarmerRegistration(createdFarmer.id)

		return { error: null }
	} catch (error) {
		console.log("error :>> ", error)
		return { error: getErrorMessage(error) }
	}
}
