import { FarmRegistrationSchema } from "@/app/(auth)/(farmer)/farmer-registration/types"
import { createFarmDetailsImages, createFarmImages } from "@/data-access/images"
import { ImageSchema } from "@/validations/image"

export const createFarmDetailsImagesUseCase = async (data: {
	images: ImageSchema[]
	farmDetailsId: string
}) => {
	try {
		await createFarmDetailsImages(data)
	} catch (error) {
		console.error("error in createFarmDetailsImagesUseCase", error)
	}
}

export const createFarmImagesUseCase = async (data: {
	images: FarmRegistrationSchema["farmImages"]
	farmerId: string
}) => {
	return await createFarmImages(data)
}
