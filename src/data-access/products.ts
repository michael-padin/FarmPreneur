import { UpdateProductSchema } from "@/app/dashboard/(admin)/products/[id]/edit/validations"
import { CreateProductSchema } from "@/app/dashboard/(admin)/products/create/validations"
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

export const getProductById = async (id: string) => {
	return await db.product.findUnique({
		where: { id },
		include: {
			farmer: true,
			images: true,
			pickupLocation: true,
			category: true
		}
	})
}

// MARK: MUTATIONS

export const createProductFromAdmin = async (
	data: CreateProductSchema & { slug: string }
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
		db.product.deleteMany({ where: { id: { in: ids } } })
	])
}

export const updateProduct = async (
	data: UpdateProductSchema & { productId: string; slug: string }
) => {
	return await db.$transaction(async (tx) => {
		// First, fetch the existing product with its images
		const existingProduct = await tx.product.findUnique({
			where: { id: data.productId },
			include: { images: true }
		})

		const existingImageUrls = new Set(
			existingProduct?.images.map((img) => img.url)
		)
		const newImageUrls = new Set(data.images.map((img) => img.url))

		const imagesToDelete = existingProduct?.images.filter(
			(img) => !newImageUrls.has(img.url)
		)
		const imagesToCreate = data.images.filter(
			(img) => !existingImageUrls.has(img.url)
		)

		// Update the product
		const updatedProduct = await tx.product.update({
			where: { id: data.productId },
			data: {
				title: data.title,
				description: data.description,
				price: data.price,
				quantity: data.quantity,
				listingStatus: data.listingStatus,
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
					update: {
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
					deleteMany: {
						url: { in: imagesToDelete?.map((img) => img.url) }
					},
					create: imagesToCreate.map((image) => ({
						type: "PRODUCT",
						url: image.url,
						filename: image.filename,
						size: image.size,
						mimeType: image.mimeType
					}))
				}
			},
			include: { images: true }
		})

		return updatedProduct
	})
}
