import { createProductType } from "@/app/dashboard/farmer/products/create/types"
import { db } from "@/lib/db"

export const createProduct = async (data: createProductType) => {
	await db.product.create({
		data: {
			title: data.title,
			description: data.description,
			price: data.price,
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

export const getAllProducts = async () => {
	return await db.product.findMany({
		select: {
			id: true,
			title: true,
			description: true,
			price: true,
			unit: true,
			quantity: true,
			images: true,
			pickupLocation: true,
			farmer: {
				select: {
					name: true
				}
			},
			orders: true,
			reviews: true,
			farmerId: true,
			listingStatus: true,
			createdAt: true,
			updatedAt: true,
			category: true,
			categoryId: true
		}
	})
}

export const deleteProductsById = async (ids: string[]) => {
	return await db.$transaction([
		db.user.deleteMany({ where: { id: { in: ids } } })
	])
}
