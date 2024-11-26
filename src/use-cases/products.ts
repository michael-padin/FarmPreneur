import { UpdateProductSchema } from "@/app/dashboard/(admin)/products/[id]/edit/validations"
import { CreateProductSchema } from "@/app/dashboard/(admin)/products/create/validations"
import { createProductType } from "@/app/dashboard/farmer/products/create/types"
import {
	createProductFromAdmin,
	deleteProductsById,
	getAllProducts,
	getPendingProducts,
	getProductById,
	getProductReviewStats,
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

export const getTopProductsUseCase = async (limit = 5) => {
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
