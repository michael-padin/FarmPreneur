"use server"
import { getErrorMessage } from "@/lib/handle-error"
import { createFarmDetailsByFarmerIdUseCase } from "@/use-cases/farm-details"
import { createFarmDetailsAddressUseCase } from "@/use-cases/address"
import { createFarmDetailsImagesUseCase } from "@/use-cases/images"
import { setupFarmInformationSchema, SetupFarmInformationSchema } from "./types"

export const createFarmDetailsAction = async (
	data: SetupFarmInformationSchema,
	farmerId: string
) => {
	try {
		await setupFarmInformationSchema.parseAsync(data)

		const { id } = await createFarmDetailsByFarmerIdUseCase({
			...data,
			farmerId
		})
		// create address and farm images reference by farmDetailsId
		await Promise.all([
			createFarmDetailsAddressUseCase({
				...data.address,
				farmDetailsId: id
			}),
			createFarmDetailsImagesUseCase({
				images: data.images,
				farmDetailsId: id
			})
		])
		return { error: null }
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
}
