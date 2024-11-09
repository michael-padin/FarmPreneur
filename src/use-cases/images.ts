import { FarmRegistrationSchema } from "@/app/(auth)/(farmer)/farmer-registration/types"
import { createFarmImages } from "@/data-access/images"

export const createFarmImagesUseCase = async (data: {
	images: FarmRegistrationSchema["farmImages"]
	farmerId: string
}) => {
	return await createFarmImages(data)
}
