"use server"
import { createProductUseCase } from "@/use-cases/products"
import { createProductSchema, createProductType } from "./types"

export const createProductAction = async (data: createProductType) => {
	const parsedData = createProductSchema.safeParse(data)
	if (!parsedData.success) {
		return { error: "Invalid fields" }
	}

	try {
		await createProductUseCase(data)
		return { success: "Product created successfully" }
	} catch (error) {
		console.log(error)
		return { error: "Something went wrong" }
	}
}
