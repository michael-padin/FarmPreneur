import { createProductType } from "@/app/dashboard/@farmer/products/create/types"
import { createProduct } from "@/data-access/products"

export const createProductUseCase = async (data: createProductType) => {
	try {
		await createProduct(data)
	} catch (error) {
		throw error
	}
}
