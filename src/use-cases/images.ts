import { createFarmDetailsImages } from "@/data-access/images"
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
