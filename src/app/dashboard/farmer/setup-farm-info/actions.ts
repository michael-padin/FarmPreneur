import { getErrorMessage } from "@/lib/handle-error"
import { SetupFarmInfoSchema, SetupFarmInfoType } from "./validations"
import { createFarmDetailsByUserIdUseCase } from "@/use-cases/farm-details"

export const setupFarmInfo = async (data: {
	data: SetupFarmInfoType & { farmerId: string }
}) => {
	const validatedFields = SetupFarmInfoSchema.safeParse(data)
	if (!validatedFields.success) {
		return { error: "Invalid fields" }
	}

	const response = await createFarmDetailsByUserIdUseCase({
		...data,
		userId: "df"
	})

	try {
		return { error: null }
	} catch (error) {
		return {
			error: getErrorMessage(error)
		}
	}
}
