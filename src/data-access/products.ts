import { createProductType } from "@/app/dashboard/farmer/products/create/types"
import { db } from "@/lib/db"

export const createProduct = async (data: createProductType) => {
	await db.product.create({
		data: {
			farmerId: data.farmerId,
			title: data.title,
			description: data.description,
			price: data.price,
			location: data.location,
			quantity: data.quantity,
			categoryId: data.category,
			images: {
				createMany: {
					data: data.images.map((image) => ({
						type: "PRODUCT",
						url: image.url,
						filename: image.filename,
						size: image.size,
						mimeType: image.mimeType
					}))
				}
			}
		}
	})
}
