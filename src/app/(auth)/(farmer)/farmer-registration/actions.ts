"use server"
import { notifyAdminNewFarmerRegistration } from "@/app/actions/notifications"
import { auth, unstable_update } from "@/auth"
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
	const session = await auth()

	if (!session?.user) {
		return { error: "Unauthorized" }
	}

	try {
		const createdFarmer = await createUserFarmerByIdUseCase({
			...data
		})

		await unstable_update({
			user: { ...session?.user, farmerId: createdFarmer.id }
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
