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
import { getTotalRevenueByDate } from "@/data-access/orders"

export const getFarmerOwnProfileUseCase = async () => {
	const session = await auth()

	if (!session || !session.user.id) throw new Error("Unauthorized!")
	const farmer = await getFarmerOwnProfile(session.user.id)
	if (!farmer) throw new Error("Farmer not found!")

	const averageRating =
		farmer.reviews.reduce((sum, review) => sum + review.rating, 0) /
			farmer.reviews.length || 0

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
	if (!session || !session.user) throw new Error("Unauthorized")

	const farmer = await getFarmerByUserId(session.user.id!)

	if (!farmer) throw new Error("No farmer found!")

	const totalProducts = farmer._count.products
	const productIds =
		(farmer.products.length > 0 &&
			farmer.products.map((product) => product.id)) ||
		[]
	const categoriesCount = await getCountCategories(productIds)

	const totalOrders = farmer._count.orders
	const pendingOrdersCount = farmer.orders.filter(
		(product) => product.status === "PENDING"
	).length
	const completedOrdersCount = farmer.orders.filter(
		(product) => product.status === "COMPLETED"
	).length

	const currentDate = new Date()
	const lastMonthDate = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth() - 1,
		1
	)

	const totalRevenue = farmer.orders.reduce(
		(sum, order) => sum + order.totalPrice!,
		0
	)

	const {
		_sum: { totalPrice: lastMonthRevenue = 0 }
	} = await getTotalRevenueByDate(lastMonthDate)

	const revenueGrowthPercentage = lastMonthRevenue
		? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
		: totalRevenue > 0
			? 100
			: 0

	const averageRating =
		farmer.reviews.reduce((sum, review) => sum + review.rating, 0) /
			farmer.reviews.length || 0

	const totalReviews = farmer.reviews.length

	return {
		revenue: {
			totalRevenue,
			revenueGrowthPercentage
		},
		products: {
			totalProducts,
			categoriesCount
		},
		orders: {
			totalOrders,
			pendingOrdersCount,
			completedOrdersCount
		},
		rating: {
			averageRating,
			totalReviews
		}
	}
}

export const getFarmerInfoInProductDetailsUseCase = async (id: string) => {
	const farmer = await getFarmerById(id)

	if (!farmer) throw new Error("No farmer found!")

	const totalProducts = farmer._count.products
	const averageRating =
		farmer.reviews.reduce((sum, review) => sum + review.rating, 0) /
			farmer.reviews.length || 0

	const totalReviews = farmer.reviews.length
	return {
		numberOfProducts: totalProducts,
		totalReviews,
		averageRating,
		farmName: farmer.farmName,
		name: farmer.user.name,
		contactNumber: farmer.contactNumber,
		address: farmer.address[0].fullAddress,
		image: farmer.farmImages[0].url,
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
