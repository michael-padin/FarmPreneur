"use server"
import { getErrorMessage } from "@/lib/handle-error"
import { farmRegistrationSchema, FarmRegistrationSchema } from "./types"
import { createUserFarmerByIdUseCase } from "@/use-cases/users"

export const upsertFarmerAction = async (
	data: FarmRegistrationSchema & { userId: string }
) => {
	try {
		const validatedFields = farmRegistrationSchema.safeParse(data)

		if (!validatedFields.success) {
			return { error: "Invalid fields" }
		}

		await createUserFarmerByIdUseCase({
			...data
		})

		return { error: null }
	} catch (error) {
		console.log("error :>> ", error)
		return { error: getErrorMessage(error) }
	}
}
