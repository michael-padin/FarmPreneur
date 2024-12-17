import { ProductSort } from "@/app/(home)/products/(list)/searchParams"
import { UpdateProductSchema } from "@/app/dashboard/(admin)/products/[id]/edit/validations"
import { CreateProductSchema } from "@/app/dashboard/(admin)/products/create/validations"
import { CreateProductSchema as CreateProductSchemaFarmer } from "@/app/dashboard/farmer/products/create/validations"
import { db } from "@/lib/db"
import { Address, ProductListingStatus } from "@prisma/client"

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
			farmerId: data.farmerId,
			productImages: data.images.map((image) => image.url)
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
export const getTotalProducts = async (farmerId?: string) => {
	return await db.product.count({
		where: farmerId ? { farmerId } : {}
	})
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
					orderItem: {
						where: {
							order: {
								status: "COMPLETED"
							}
						}
					},
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
			}
		}
	})
}

export const getProductById = async (id: string) => {
	return await db.product.findFirst({
		where: { id },
		include: {
			farmer: {
				select: {
					profilePicture: true,
					farmName: true,
					id: true,
					contactNumber: true,
					user: {
						select: {
							id: true
						}
					},
					address: {
						select: {
							id: true,
							fullAddress: true,
							longitude: true,
							latitude: true,
							note: true
						}
					}
				}
			},
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

		include: {
			_count: {
				select: {
					orderItem: {
						where: {
							order: {
								status: "COMPLETED"
							}
						}
					}
				}
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
			productImages: true,
			reviews: {
				select: { rating: true }
			},
			orderItem: {
				where: {
					order: {
						createdAt: {
							gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
						},
						status: "COMPLETED"
					}
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
		const monthlySales = product.orderItem.reduce(
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
			image: product.productImages[0] || null,
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
			category: true
		}
	})
}

// this query is on the product list page - /products
export const getProductsOnProductListPage = async (filters: {
	search?: string
	sortBy?: ProductSort
}) => {
	const {
		search,
		// category,
		// rating,
		// minPrice,
		// maxPrice,
		sortBy
		// page = 1,
		// limit = 20
	} = filters

	// Define sorting logic
	const sortOptions: Record<string, any> = {
		relevance: [
			{ title: "desc" } // Boost popular products
			// { title: { contains: search || "", mode: "insensitive" } }, // Partial match on title
			// { description: { contains: search || "", mode: "insensitive" } } // Partial match on description
		],
		latest: { createdAt: "desc" },
		topSales: { sales: "desc" },
		priceLowToHigh: { price: "asc" },
		priceHighToLow: { price: "desc" }
	}

	return await db.product.findMany({
		where: {
			AND: [
				search
					? {
							OR: [
								{ title: { contains: search, mode: "insensitive" } },
								{ description: { contains: search, mode: "insensitive" } },
								{
									category: { name: { contains: search, mode: "insensitive" } }
								}
							],
							listingStatus: "APPROVED"
						}
					: { listingStatus: "APPROVED" }
			]
		},
		orderBy:
			sortBy === "relevance"
				? sortOptions.relevance
				: sortOptions[sortBy || "latest"],

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
			orderItem: {
				include: {
					order: {
						select: {
							status: true
						}
					}
				}
			},
			images: true,
			category: true,
			_count: {
				select: {
					reviews: true
				}
			},
			reviews: true
		}
	})
}
// this query is on the product list page - /products
export const getFarmerProductLists = async (filters: {
	search?: string
	sortBy?: ProductSort
	farmerId?: string
}) => {
	const {
		farmerId,
		search,
		// category,
		// rating,
		// minPrice,
		// maxPrice,
		sortBy
		// page = 1,
		// limit = 20
	} = filters

	// Define sorting logic
	const sortOptions: Record<string, any> = {
		relevance: [
			{ title: "desc" } // Boost popular products
			// { title: { contains: search || "", mode: "insensitive" } }, // Partial match on title
			// { description: { contains: search || "", mode: "insensitive" } } // Partial match on description
		],
		latest: { createdAt: "desc" },
		topSales: { sales: "desc" },
		priceLowToHigh: { price: "asc" },
		priceHighToLow: { price: "desc" }
	}

	return await db.product.findMany({
		where: {
			AND: [
				search
					? {
							OR: [
								{ title: { contains: search, mode: "insensitive" } },
								{ description: { contains: search, mode: "insensitive" } },
								{
									category: { name: { contains: search, mode: "insensitive" } }
								}
							],
							...(farmerId ? { farmerId } : {}),
							listingStatus: "APPROVED"
						}
					: { listingStatus: "APPROVED", ...(farmerId ? { farmerId } : {}) }
			]
		},
		orderBy:
			sortBy === "relevance"
				? sortOptions.relevance
				: sortOptions[sortBy || "latest"],

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
			orderItem: {
				include: {
					order: {
						select: {
							status: true
						}
					}
				}
			},
			images: true,
			category: true,
			_count: {
				select: {
					reviews: true
				}
			},
			reviews: true
		}
	})
}

// this query is on the home page for daily products - /
export const getDailyProducts = async (address?: Address) => {
	return await db.product.findMany({
		where: {
			listingStatus: ProductListingStatus.APPROVED
		},
		orderBy: {
			createdAt: "desc"
		},
		take: 100,
		include: {
			orderItem: {
				select: {
					quantity: true,
					order: { select: { status: true } }
				}
			},
			farmer: {
				include: {
					user: {
						select: {
							name: true
						}
					}
				}
			},
			_count: {
				select: {
					reviews: true
				}
			},
			images: true,
			reviews: true,
			category: true
		}
	})
}

// MARK: SEARCH SUGGESTIONS
export const getProductsSuggestions = async (filter: {
	search: string | null
}) => {
	const search = filter.search
	if (!search) {
		return []
	}
	return await db.product.findMany({
		where: {
			OR: [
				{
					title: {
						contains: search,
						mode: "insensitive"
					}
				},
				{
					description: {
						contains: search,
						mode: "insensitive"
					}
				},
				{
					category: {
						OR: [
							{
								name: {
									contains: search,
									mode: "insensitive"
								}
							},
							{
								description: {
									contains: search,
									mode: "insensitive"
								}
							}
						]
					}
				},
				{
					farmer: {
						OR: [
							{
								farmName: {
									contains: search,
									mode: "insensitive"
								}
							},
							{
								address: {
									some: {
										fullAddress: {
											contains: search,
											mode: "insensitive"
										}
									}
								}
							}
						]
					}
				}
			]
		}
	})
}

export const getProductBySlug = async (slug: string) => {
	return await db.product.findUnique({
		where: { slug },
		include: {
			farmer: {
				select: {
					id: true,
					farmName: true,
					user: {
						select: {
							name: true
						}
					},
					address: true,
					contactNumber: true,
					farmImages: true
				}
			},
			orderItem: {
				select: {
					quantity: true,
					order: {
						select: {
							status: true
						}
					}
				}
			},
			_count: {
				select: {
					orderItem: {
						where: {
							order: {
								status: "COMPLETED"
							}
						}
					}
				}
			},
			reviews: true,
			category: {
				select: {
					name: true
				}
			}
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
		// Update the product
		const updatedProduct = await tx.product.update({
			where: { id: data.productId },
			data: {
				title: data.title,
				description: data.description,
				price: data.price,
				quantity: data.quantity,
				productImages: { set: data.images.map((image) => image.url) },
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

				slug: data.slug,
				unit: data.unit
			},
			include: {
				images: true,
				farmer: {
					include: {
						user: {
							select: {
								id: true
							}
						}
					}
				}
			}
		})

		return updatedProduct
	})
}
