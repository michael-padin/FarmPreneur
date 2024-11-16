import { UpdateProductSchema } from "@/app/dashboard/(admin)/products/[id]/edit/validations"
import { CreateProductSchema } from "@/app/dashboard/(admin)/products/create/validations"
import { createProductType } from "@/app/dashboard/farmer/products/create/types"
import {
	createProductFromAdmin,
	deleteProductsById,
	getAllProducts,
	getProductById,
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
