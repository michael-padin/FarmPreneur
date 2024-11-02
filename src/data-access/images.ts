import { db } from "@/lib/db"
import { ImageSchema } from "@/validations/image"

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
