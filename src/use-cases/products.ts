import { ProductListingStatus } from "@prisma/client"
import { UpdateProductSchema } from "@/app/dashboard/(admin)/products/[id]/edit/validations"
import { CreateProductSchema } from "@/app/dashboard/(admin)/products/create/validations"
import { createProductType } from "@/app/dashboard/farmer/products/create/types"
import { auth } from "@/auth"
import {
	createProductFromAdmin,
	deleteProductsById,
	getAllProducts,
	getPendingProducts,
	getProductById,
	getProductReviewStats,
	getProducts,
	getTopProducts,
	getTopSellingProducts,
	getTotalProducts,
	getTotalProductsByDate,
	updateProduct
} from "@/data-access/products"

export const createProductUseCase = async (data: createProductType) => {
	try {
		// await createProduct(data)
	} catch (error) {
		throw error
	}
}

export const getProductByIdUseCase = async (id: string) => {
	return await getProductById(id)
}

export const getAllProductsUseCase = async () => {
	return getAllProducts()
}

export const deleteProductsByIdUseCase = async (ids: string[]) => {
	return deleteProductsById(ids)
}

export const getTopProductsUseCase = async (limit = 10) => {
	try {
		return await getTopProducts(limit)
	} catch (error) {
		throw error
	}
}

export const getTotalProductsUseCase = async () => {
	const currentDate = new Date()
	const lastMonthDate = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth() - 1,
		1
	)
	try {
		const totalProducts = await getTotalProducts()
		const increaseChange =
			totalProducts - (await getTotalProductsByDate(lastMonthDate))
		return { totalProducts, increaseChange }
	} catch (error) {
		throw error
	}
}

export const getProductReviewStatsUseCase = async () => {
	try {
		return await getProductReviewStats()
	} catch (error) {
		throw error
	}
}

export const getTopSellingProductsUseCase = async (limit = 10) => {
	try {
		return await getTopSellingProducts(limit)
	} catch (error) {
		throw error
	}
}

export const getPendingProductsUseCase = async () => {
	try {
		return await getPendingProducts()
	} catch (error) {
		throw error
	}
}

// FARMER QUERIES HERE
export const getProductsUseCase = async (filter: {
	status: ProductListingStatus | null
}) => {
	try {
		const session = await auth()
		if (!session || !session.user) throw new Error("Unauthorized")

		return await getProducts({
			status: filter.status,
			userId: session.user.id!
		})
	} catch (error) {
		throw error
	}
}

// MARK: MUTATIONS
export const createProductFromAdminUseCase = async (
	data: CreateProductSchema & { slug: string }
) => {
	return await createProductFromAdmin(data)
}

export const updateProductUseCase = async (
	data: UpdateProductSchema & { productId: string; slug: string }
) => {
	return await updateProduct(data)
}
