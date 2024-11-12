"use server"
import { getErrorMessage } from "@/lib/handle-error"
import { farmRegistrationSchema, FarmRegistrationSchema } from "./types"
import { createUserFarmerByIdUseCase } from "@/use-cases/users"
import { pusherServer } from "@/lib/pusher"
import { getPendingFarmerCountUseCase } from "@/use-cases/farmers"

export const upsertFarmerAction = async (
	data: FarmRegistrationSchema & { userId: string }
) => {
	try {
		const validatedFields = farmRegistrationSchema.safeParse(data)

		if (!validatedFields.success) {
			return { error: "Invalid fields" }
		}

		const createdFarmer = await createUserFarmerByIdUseCase({
			...data
		})

		if (createdFarmer.applicationStatus === "PENDING") {
			await pusherServer.trigger("pending-farmers-count", "update", {
				count: await getPendingFarmerCountUseCase()
			})
		}

		return { error: null }
	} catch (error) {
		console.log("error :>> ", error)
		return { error: getErrorMessage(error) }
	}
}
