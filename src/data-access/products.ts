import { UpdateProductSchema } from "@/app/dashboard/(admin)/products/[id]/edit/validations"
import { CreateProductSchema } from "@/app/dashboard/(admin)/products/create/validations"
import { CreateProductSchema as CreateProductSchemaFarmer } from "@/app/dashboard/farmer/products/create/validations"
import { db } from "@/lib/db"
import { ProductListingStatus } from "@prisma/client"

export const createProduct = async (
	data: CreateProductSchemaFarmer & {
		farmerId: string
		slug: string
	}
) => {
	return await db.product.create({
		data: {
			listingStatus: "PENDING",
			title: data.title,
			description: data.description,
			unit: data.unit,
			slug: data.slug,
			price: data.price,
			quantity: data.quantity,
			categoryId: data.categoryId,
			pickupLocationId: data.pickupLocationId,
			farmerId: data.farmerId,
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
		},
		include: {
			farmer: {
				select: {
					id: true,
					farmName: true
				}
			},
			images: {
				select: {
					url: true
				}
			}
		}
	})
}
export const getTotalProducts = async () => {
	return await db.product.count()
}

export const getTotalProductsByDate = async (date: Date) => {
	return await db.product.count({
		where: {
			createdAt: {
				gte: date
			}
		}
	})
}
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

export const getProductReviewStats = async () => {
	return await db.productReview.aggregate({
		_avg: {
			rating: true
		},
		_count: {
			_all: true
		}
	})
}
export const getTopSellingProducts = async (limit = 10) => {
	return await db.product.findMany({
		take: limit,
		orderBy: {
			orders: {
				_count: "desc"
			}
		},
		include: {
			_count: {
				select: { orders: true }
			}
		}
	})
}

export const getPendingProducts = async () => {
	return await db.product.findMany({
		where: {
			listingStatus: "PENDING"
		},
		include: {
			farmer: {
				include: {
					user: {
						select: {
							name: true
						}
					}
				}
			},
			images: true,
			pickupLocation: true,
			category: true
		}
	})
}

export const getTopProducts = async (limit = 10) => {
	const products = await db.product.findMany({
		select: {
			id: true,
			title: true,
			price: true,
			unit: true,
			images: {
				where: { isPrimary: true },
				select: { url: true }
			},
			reviews: {
				select: { rating: true }
			},
			orders: {
				where: {
					createdAt: {
						gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
					},
					status: "COMPLETED"
				},
				select: { quantity: true }
			},
			createdAt: true // Include created date for fallback ranking
		},
		where: {
			listingStatus: "APPROVED"
		}
	})

	const weights = {
		monthlySales: 0.6,
		averageRating: 0.3,
		numberOfReviews: 0.1
	}

	const metrics = products.map((product) => {
		const averageRating =
			product.reviews.reduce((sum, review) => sum + review.rating, 0) /
				product.reviews.length || 0
		const monthlySales = product.orders.reduce(
			(sum, order) => sum + order.quantity,
			0
		)
		const numberOfReviews = product.reviews.length

		return { averageRating, monthlySales, numberOfReviews }
	})

	const maxValues = {
		monthlySales: Math.max(...metrics.map((m) => m.monthlySales), 1),
		averageRating: 5,
		numberOfReviews: Math.max(...metrics.map((m) => m.numberOfReviews), 1)
	}

	// Check if all metrics are zero
	const areAllZero = metrics.every(
		({ monthlySales, averageRating, numberOfReviews }) =>
			monthlySales === 0 && averageRating === 0 && numberOfReviews === 0
	)

	// Map products to final scores or fallback
	const rankedProducts = products.map((product, index) => {
		const { averageRating, monthlySales, numberOfReviews } = metrics[index]

		const normalizedSales = monthlySales / maxValues.monthlySales || 0.1 // Default to 0.1 for fallback
		const normalizedRating = averageRating / maxValues.averageRating || 0.1
		const normalizedReviews = numberOfReviews / maxValues.numberOfReviews || 0.1

		const finalScore =
			weights.monthlySales * normalizedSales +
			weights.averageRating * normalizedRating +
			weights.numberOfReviews * normalizedReviews

		return {
			id: product.id,
			name: product.title,
			averageRating: averageRating.toFixed(1),
			numberOfReviews,
			image: product.images[0]?.url || null,
			monthlySales,
			price: product.price,
			unit: product.unit,
			finalScore: Number(finalScore.toFixed(3)),
			createdAt: product.createdAt // Fallback sorting
		}
	})

	// Fallback if all scores are zero
	if (areAllZero) {
		return rankedProducts
			.sort((a, b) => {
				const dateA = new Date(a.createdAt)
				const dateB = new Date(b.createdAt)
				return dateB.getTime() - dateA.getTime() // Compare timestamps
			})
			.slice(0, limit)
	}

	// Sort by final score
	return rankedProducts
		.sort((a, b) => b.finalScore - a.finalScore)
		.slice(0, limit)
}

// FARMER QUERIES HERE
export const getProducts = async (filter: {
	userId: string
	status?: ProductListingStatus | null
	search?: string
}) => {
	return await db.product.findMany({
		where: {
			farmer: {
				userId: filter.userId
			},
			...(filter.status && { listingStatus: filter.status }),
			...(filter.search && {
				OR: [
					{ title: { contains: filter.search, mode: "insensitive" } },
					{ description: { contains: filter.search, mode: "insensitive" } }
				]
			})
		},
		include: {
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
