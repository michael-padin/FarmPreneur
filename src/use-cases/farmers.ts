"use server"
import { FarmRegistrationSchema } from "@/app/(auth)/(farmer)/farmer-registration/types"
import { EditUserSchema } from "@/app/dashboard/(admin)/users/[id]/edit/validations"
import { auth } from "@/auth"
import { getCountCategories } from "@/data-access/categories"
import {
	createFarmerByUserId,
	getApprovedFarmers,
	getFarmerApprovalStatusByUserId,
	getFarmerById,
	getFarmerByUserId,
	getFarmerOwnProfile,
	getFarmers,
	getPendingFarmerCount,
	getPendingFarmers,
	getTopFarmers,
	updateFarmerByUserId
} from "@/data-access/farmers"
import { db } from "@/lib/db"
import {
	calculateRevenueGrowthPercentage,
	getMonthRangeByDate
} from "@/lib/utils"

export const getFarmerOwnProfileUseCase = async () => {
	const session = await auth()

	if (!session || !session.user.id) throw new Error("Unauthorized!")
	const farmer = await getFarmerOwnProfile(session.user.id)
	if (!farmer) throw new Error("Farmer not found!")

	const averageRating = 0
	// farmer.products.reviews.reduce((sum, review) => sum + review.rating, 0) /
	// 	farmer.products.reviews.length || 0

	return { ...farmer, averageRating }
}

export const getPendingFarmerCountUseCase = async () => {
	return await getPendingFarmerCount()
}

export const getApprovedFarmersUseCase = async () => {
	try {
		return await getApprovedFarmers()
	} catch (error) {
		console.log(error)
	}
}

export const getFarmersUseCase = async () => {
	return await getFarmers()
}
export const getPendingFarmersUseCase = async () => {
	return await getPendingFarmers()
}

export const getFarmerApprovalStatusByUserIdUseCase = async (id: string) => {
	return await getFarmerApprovalStatusByUserId(id)
}

export const getUserFarmerByIdUseCase = async (id: string) => {
	return await getFarmerByUserId(id)
}

export const getFarmerByUserIdUseCase = async (id: string) => {
	const farmer = await getFarmerByUserId(id)
	if (!farmer) throw new Error("Farmer not found!")
	return farmer
}

export const createFarmerByUserIdUseCase = async (
	data: FarmRegistrationSchema & { userId: string }
) => {
	return await createFarmerByUserId(data)
}

export const getTopFarmersUseCase = async () => {
	try {
		return await getTopFarmers()
	} catch (error) {
		console.log(error)
	}
}

export const getFarmerMetricsUseCase = async () => {
	const session = await auth()
	if (!session?.user) throw new Error("Unauthorized")

	const farmer = await getFarmerByUserId(session.user.id!)
	if (!farmer) throw new Error("No farmer found!")

	// Extract product IDs
	const productIds = farmer.products.map((product) => product.id)

	// Get categories count
	const categoriesCount = productIds.length
		? await getCountCategories(productIds)
		: 0

	// Calculate order status counts in one pass
	const orderStatusCounts = farmer.orders.reduce(
		(counts, order) => {
			switch (order.status) {
				case "PENDING":
					counts.pending++
					break
				case "COMPLETED":
					counts.completed++
					break
				case "IN_PROGRESS":
					counts.inProgress++
					break
			}
			counts.total++
			return counts
		},
		{ total: 0, pending: 0, completed: 0, inProgress: 0 }
	)

	// Get average rating and review count
	const { _avg: { rating } = {}, _count: { _all: totalReviews } = {} } =
		await db.productReview.aggregate({
			_avg: { rating: true },
			_count: { _all: true },
			where: {
				productId: { in: productIds },
				status: "PUBLISHED" // Ensure only published reviews are considered
			}
		})

	const currentDate = new Date()
	const { currentMonth, previousMonth } = getMonthRangeByDate(currentDate)

	// Query for last month's revenue
	const lastMonthRevenueResult = await db.order.aggregate({
		where: {
			AND: [
				{ status: "COMPLETED" },
				{ farmerId: farmer.id },
				{
					createdAt: {
						gte: previousMonth.start,
						lte: previousMonth.end
					}
				}
			]
		},
		_sum: {
			totalPrice: true
		}
	})

	// Query for current month's revenue
	const currentMonthRevenueResult = await db.order.aggregate({
		where: {
			AND: [
				{ status: "COMPLETED" },
				{ farmerId: farmer.id },
				{
					createdAt: {
						gte: currentMonth.start,
						lte: currentMonth.end
					}
				}
			]
		},
		_sum: {
			totalPrice: true
		}
	})

	const lastMonthRevenue = lastMonthRevenueResult._sum.totalPrice || 0
	const currentMonthRevenue = currentMonthRevenueResult._sum.totalPrice || 0

	const revenueGrowthPercentage = calculateRevenueGrowthPercentage(
		currentMonthRevenue,
		lastMonthRevenue
	)

	return {
		revenue: {
			totalRevenue: currentMonthRevenue,
			revenueGrowthPercentage
		},
		products: {
			totalProducts: farmer._count.products,
			categoriesCount
		},
		orders: {
			totalOrders: orderStatusCounts.total,
			pendingOrdersCount: orderStatusCounts.pending,
			completedOrdersCount: orderStatusCounts.completed,
			inProgressOrdersCount: orderStatusCounts.inProgress
		},
		rating: {
			averageRating: rating || 0,
			totalReviews: totalReviews || 0
		}
	}
}
export const getFarmerInfoInProductDetailsUseCase = async (id: string) => {
	const farmer = await getFarmerById(id)

	if (!farmer) throw new Error("No farmer found!")

	const totalProducts = farmer._count.products
	const averageRating = 0
	// farmer.reviews.reduce((sum, review) => sum + review.rating, 0) /
	// 	farmer.reviews.length || 0

	// const totalReviews = farmer.reviews.length
	const totalReviews = 0
	return {
		numberOfProducts: totalProducts,
		totalReviews,
		averageRating,
		farmName: farmer.farmName,
		name: farmer.user.name,
		contactNumber: farmer.contactNumber,
		address: farmer.address[0].fullAddress,
		profilePicture: farmer.profilePicture,
		responseRate: 100,
		id: farmer.id
	}
}

// MARK: MUTATIONS
export const updateFarmerByUserIdUseCase = async (
	data: EditUserSchema & {
		userId: string
	}
) => {
	return await updateFarmerByUserId(data)
}
