import { FarmRegistrationSchema } from "@/app/(auth)/(farmer)/farmer-registration/types"
import { db } from "@/lib/db"
import { ImageSchema } from "@/validations/image"
import { Prisma } from "@prisma/client"

export const createFarmDetailsImages = async (data: {
	images: ImageSchema[]
	farmDetailsId: string
}) => {
	return await db.$transaction(
		data.images.map((image) =>
			db.image.create({
				data: {
					filename: image.filename,
					mimeType: image.mimeType,
					size: image.size,
					type: "FARM",
					url: image.url,
					farmDetailsId: data.farmDetailsId
				}
			})
		)
	)
}

export const createFarmImages = async (data: {
	images: FarmRegistrationSchema["farmImages"]
	farmerId: string
}) => {
	return await db.$transaction(
		data.images.map((image) =>
			db.image.create({
				data: {
					filename: image.filename,
					mimeType: image.mimeType,
					size: image.size,
					type: "FARM",
					url: image.url,
					farmer: {
						connect: { id: data.farmerId }
					}
				}
			})
		)
	)
}
