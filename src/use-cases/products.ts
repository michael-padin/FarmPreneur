import { AddProductSchema } from "@/app/dashboard/(admin)/products/(lists)/validations"
import { createProductType } from "@/app/dashboard/farmer/products/create/types"
import {
	createProductFromAdmin,
	deleteProductsById,
	getAllProducts
} from "@/data-access/products"

export const createProductUseCase = async (data: createProductType) => {
	try {
		// await createProduct(data)
	} catch (error) {
		throw error
	}
}

export const getAllProductsUseCase = async () => {
	return getAllProducts()
}

export const deleteProductsByIdUseCase = async (ids: string[]) => {
	return deleteProductsById(ids)
}

export const createProductFromAdminUseCase = async (
	data: AddProductSchema & { slug: string }
) => {
	return await createProductFromAdmin(data)
}
