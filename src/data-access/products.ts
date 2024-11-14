import { AddProductSchema } from "@/app/dashboard/(admin)/products/(lists)/validations"
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
			images: true,
			pickupLocation: true
		}
	})
}

// MARK: MUTATIONS

export const createProductFromAdmin = async (
	data: AddProductSchema & { slug: string }
) => {
	await db.product.create({
		data: {
			title: data.title,
			description: data.description,
			price: data.price,
			quantity: data.quantity,
			listingStatus: "PENDING",
			farmer: {
				connect: {
					id: data.farmerId
				}
			},
			category: {
				connect: {
					id: data.categoryId
				}
			},
			pickupLocation: {
				create: {
					fullAddress: data.pickupLocation?.fullAddress || "",
					street: data.pickupLocation?.street || "",
					region: data.pickupLocation?.region || "",
					country: data.pickupLocation?.country || "",
					postalCode: data.pickupLocation?.postalCode || "",
					latitude: data.pickupLocation?.latitude || 0,
					longitude: data.pickupLocation?.longitude || 0
				}
			},
			slug: data.slug,
			unit: data.unit,
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

export const deleteProductsById = async (ids: string[]) => {
	return await db.$transaction([
		db.user.deleteMany({ where: { id: { in: ids } } })
	])
}
