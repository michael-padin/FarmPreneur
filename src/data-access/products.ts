import { createProductType } from "@/app/dashboard/farmer/products/create/types"
import { db } from "@/lib/db"

export const createProduct = async (data: createProductType) => {
	await db.product.create({
		data: {
			farmerId: data.farmerId,
			title: data.title,
			description: data.description,
			category: data.category,
			price: data.price,
			location: data.location,
			images: data.images,
			quantity: data.quantity
		}
	})
}
