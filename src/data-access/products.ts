import { createProductType } from "@/app/dashboard/farmer/products/create/types"
import { db } from "@/lib/db"

// export const createProduct = async (data: createProductType) => {
// 	await db.product.create({
// 		data: {

// 			title: data.title,
// 			description: data.description,
// 			price: data.price,
// 			quantity: data.quantity,
// 			categoryId: data.category,
// 			images: {
// 				createMany: {
// 					data: data.images.map((image) => ({
// 						type: "PRODUCT",
// 						url: image.url,
// 						filename: image.filename,
// 						size: image.size,
// 						mimeType: image.mimeType
// 					}))
// 				}
// 			}
// 		}
// 	})
// }

export const getAllProducts = async () => {
	return await db.product.findMany({
		include: {
			_count: {
				select: {
					cartItems: true,
					orders: true,
					reviews: true,
					images: true,
					wishlistItems: true
				}
			},
			farmer: {
				select: {
					user: {
						select: {
							name: true,
							email: true
						}
					}
				}
			},
			pickupLocation: true
		}
	})
}

export const deleteProductsById = async (ids: string[]) => {
	return await db.$transaction([
		db.user.deleteMany({ where: { id: { in: ids } } })
	])
}
