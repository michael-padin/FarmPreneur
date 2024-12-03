import { FarmRegistrationSchema } from "@/app/(auth)/(farmer)/farmer-registration/types"
import { EditUserSchema } from "@/app/dashboard/(admin)/users/[id]/edit/validations"
import { db } from "@/lib/db"

export const getFarmerOwnProfile = async (userId: string) => {
	return await db.farmer.findUnique({
		where: {
			userId: userId
		},
		include: {
			_count: {
				select: {
					address: true,
					farmImages: true,
					orders: true,
					products: true,
					reviews: true
				}
			},
			user: {
				include: {
					profilePicture: true
				}
			},
			reviews: true,

			address: true,
			farmImages: true
		}
	})
}

export const getFarmerByUserId = async (userId: string) => {
	return await db.farmer.findUnique({
		where: {
			userId: userId
		},
		select: {
			id: true,
			birthDate: true,
			applicationStatus: true,
			contactNumber: true,
			farmName: true,
			farmDescription: true,
			userId: true,
			createdAt: true,
			updatedAt: true,
			address: true,
			orders: true,
			reviews: true,
			verificationDocument: {
				select: {
					image: true,
					type: true
				}
			},
			products: true,
			user: {
				select: {
					emailVerified: true,
					id: true,
					name: true,
					email: true,
					role: true,
					isEmailVerified: true,
					createdAt: true,
					image: true,
					updatedAt: true
				}
			}
		}
	})
}

export const getFarmers = async () => {
	return await db.user.findMany({
		where: {
			role: "FARMER"
		},
		select: {
			id: true,
			createdAt: true,
			updatedAt: true,
			name: true,
			email: true,
			role: true,
			profilePicture: true,
			isEmailVerified: true,
			emailVerified: true,
			farmer: {
				include: {
					_count: {
						select: {
							orders: true,
							farmImages: true,
							products: true,
							reviews: true
						}
					},
					address: true,
					verificationDocument: {
						include: {
							image: true
						}
					}
				}
			}
		},
		orderBy: {
			createdAt: "desc"
		}
	})
}

export const getPendingFarmers = async () => {
	return await db.farmer.findMany({
		where: {
			AND: [{ user: { role: "FARMER" } }, { applicationStatus: "PENDING" }]
		},
		include: {
			user: {
				select: {
					id: true,
					createdAt: true,
					updatedAt: true,
					name: true,
					email: true,
					role: true,
					profilePicture: true,
					isEmailVerified: true,
					emailVerified: true
				}
			},
			address: true,
			orders: true,
			reviews: true,
			verificationDocument: {
				include: {
					image: true
				}
			}
		},
		orderBy: {
			createdAt: "desc"
		}
	})
}

export const getFarmerApprovalStatusByUserId = async (id: string) => {
	return db.farmer.findUnique({
		where: {
			userId: id
		},
		select: {
			applicationStatus: true
		}
	})
}

export const getPendingFarmerCount = async () => {
	return await db.farmer.count({
		where: {
			applicationStatus: "PENDING"
		}
	})
}

export const getApprovedFarmers = async () => {
	return await db.farmer.findMany({
		where: {
			applicationStatus: "APPROVED"
		},
		include: {
			user: {
				select: {
					id: true,
					createdAt: true,
					updatedAt: true,
					name: true,
					email: true,
					role: true,
					profilePicture: true,
					isEmailVerified: true,
					emailVerified: true
				}
			},
			address: true
		}
	})
}
export const getTopPerformingFarmers = async (limit = 5) => {
	return await db.farmer.findMany({
		take: limit,
		orderBy: {
			orders: {
				_count: "desc"
			}
		},
		include: {
			_count: {
				select: { orders: true }
			},
			user: {
				select: { name: true }
			}
		}
	})
}

export const getTopFarmers = async (limit = 10) => {
	const farmers = await db.farmer.findMany({
		select: {
			id: true,
			farmName: true,
			farmImages: {
				select: { url: true }
			},
			user: {
				select: {
					name: true,
					profilePicture: { select: { url: true } }
				}
			},
			products: { select: { id: true } }, // Number of products
			orders: {
				select: {
					id: true,
					status: true,
					createdAt: true // Include for fallback sorting
				}
			},
			reviews: { select: { rating: true } },
			address: { select: { fullAddress: true } },
			createdAt: true // Include for fallback ranking
		},
		where: {
			applicationStatus: "APPROVED"
		}
	})

	// Define weights for scoring
	const weights = {
		totalSales: 0.5, // 50% weight for sales
		averageRating: 0.3, // 30% weight for ratings
		responseRate: 0.2 // 20% weight for response rate
	}

	// Calculate metrics for each farmer
	const metrics = farmers.map((farmer) => {
		const totalSales = farmer.orders.filter(
			(order) => order.status === "COMPLETED"
		).length
		const averageRating =
			farmer.reviews.reduce((sum, review) => sum + review.rating, 0) /
				farmer.reviews.length || 0
		const responseRate =
			farmer.orders.filter((order) => order.status !== "PENDING").length /
			(farmer.orders.length || 1)
		const numberOfProducts = farmer.products.length

		return { totalSales, averageRating, responseRate, numberOfProducts }
	})

	// Find max values for normalization
	const maxValues = {
		totalSales: Math.max(...metrics.map((m) => m.totalSales), 1),
		averageRating: 5, // Ratings are out of 5
		responseRate: 1, // Response rate is a percentage
		numberOfProducts: Math.max(...metrics.map((m) => m.numberOfProducts), 1)
	}

	// Check if all metrics (except products) are zero
	const arePrimaryMetricsZero = metrics.every(
		({ totalSales, averageRating, responseRate }) =>
			totalSales === 0 && averageRating === 0 && responseRate === 0
	)

	// Check if all products are zero
	const areProductsZero = metrics.every(
		({ numberOfProducts }) => numberOfProducts === 0
	)

	// Map farmers to final scores or fallback
	const rankedFarmers = farmers.map((farmer, index) => {
		const { totalSales, averageRating, responseRate, numberOfProducts } =
			metrics[index]

		// Normalize metrics
		const normalizedSales = totalSales / maxValues.totalSales || 0.1
		const normalizedRating = averageRating / maxValues.averageRating || 0.1
		const normalizedResponseRate = responseRate / maxValues.responseRate || 0.1

		// Compute final score based on weights
		const finalScore =
			weights.totalSales * normalizedSales +
			weights.averageRating * normalizedRating +
			weights.responseRate * normalizedResponseRate

		return {
			id: farmer.id,
			name: farmer.user.name || farmer.farmName,
			averageRating: averageRating.toFixed(1),
			totalSales,
			responseRate: (responseRate * 100).toFixed(1) + "%",
			image: farmer.user.profilePicture?.url || farmer.farmImages?.[0]?.url,
			address: farmer.address?.[0]?.fullAddress,
			finalScore: Number(finalScore.toFixed(3)),
			numberOfProducts,
			createdAt: farmer.createdAt // Fallback sorting
		}
	})

	// Fallback if all primary metrics are zero
	if (arePrimaryMetricsZero) {
		if (!areProductsZero) {
			// Sort by number of products
			return rankedFarmers
				.sort((a, b) => b.numberOfProducts - a.numberOfProducts)
				.slice(0, limit)
		}
		// If products are also zero, sort by createdAt
		// return rankedFarmers
		// 	.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
		// 	.slice(0, limit)
	}

	// Sort by final score and limit the results
	return rankedFarmers
		.sort((a, b) => b.finalScore - a.finalScore)
		.slice(0, limit)
}

// MARK: MUTATIONS
export const createFarmerByUserId = async (
	data: FarmRegistrationSchema & { userId: string }
) => {
	return await db.farmer.create({
		data: {
			applicationStatus: "PENDING",
			userId: data.userId,
			contactNumber: data.contactNumber,
			birthDate: new Date(data.birthDate),
			farmName: data.farmName,
			farmDescription: data.farmDescription
		}
	})
}

export const updateFarmerByUserId = async (
	data: EditUserSchema & {
		userId: string
	}
) => {
	return await db.$transaction(async (tx) => {
		const updatedUser = await tx.user.update({
			where: {
				id: data.userId
			},
			data: {
				name: data.name,
				email: data.email as string,
				isEmailVerified: data.isEmailVerified,
				role: data.role,
				...(data.password && { password: data.password })
			}
		})

		console.log("Updating farmer...")
		const updatedFarmer =
			data.farmer &&
			(await tx.farmer.upsert({
				where: {
					userId: data.userId
				},
				create: {
					userId: data.userId,
					applicationStatus: "PENDING",
					contactNumber: data.farmer.contactNumber,
					birthDate: data.farmer!.birthDate,
					farmName: data?.farmer?.farmName,
					farmDescription: data?.farmer?.farmDescription
				},
				update: {
					contactNumber: data.farmer.contactNumber,
					birthDate: data.farmer!.birthDate,
					farmName: data?.farmer?.farmName,
					farmDescription: data?.farmer?.farmDescription,
					applicationStatus: data?.farmer?.applicationStatus
					// address: {
					// 	update: {
					// 		latitude: data.farmer.address.latitude,
					// 		longitude: data.farmer.address.longitude,
					// 		fullAddress: data.farmer.address.fullAddress,
					// 		street: data.farmer.address.street,
					// 		region: data.farmer.address.region,
					// 		country: data.farmer.address.country,
					// 		postalCode: data.farmer.address.postalCode
					// 	}
					// }
				}
			}))

		console.log("Updating farmer verification document...")
		const updatedVerificationDocument =
			data.farmer?.verificationDocument &&
			data.farmer?.verificationDocument.image &&
			(await tx.verificationDocument.upsert({
				where: {
					farmerId: updatedFarmer!.id
				},
				create: {
					type: data.farmer.verificationDocument.type,
					image: {
						create: {
							url: data.farmer.verificationDocument.image.url,
							filename: data.farmer.verificationDocument.image.filename,
							size: data.farmer.verificationDocument.image.size,
							mimeType: data.farmer.verificationDocument.image.mimeType,
							type: "VERIFICATION"
						}
					}
				},
				update: {
					image: {
						update: {
							url: data.farmer.verificationDocument.image.url,
							filename: data.farmer.verificationDocument.image.filename,
							size: data.farmer.verificationDocument.image.size,
							mimeType: data.farmer.verificationDocument.image.mimeType
						}
					}
				}
			}))
		return {
			applicationStatus: updatedFarmer?.applicationStatus
		}
	})
}
