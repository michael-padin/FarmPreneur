"use server"
import { generateSlug, INITIAL_MAX_ITERATIONS } from "@/lib/slugify"
import { updateProductSchema, UpdateProductSchema } from "./validations"
import { getCategoryBySlug } from "@/data-access/categories"
import { revalidatePath } from "next/cache"
import { getErrorMessage } from "@/lib/handle-error"
import { updateProductUseCase } from "@/use-cases/products"

export const adminUpdateProduct = async (
	data: UpdateProductSchema & {
		productId: string
	}
) => {
	const validatedFields = updateProductSchema.safeParse(data)
	if (!validatedFields.success) {
		return {
			error: validatedFields.error.message
		}
	}

	try {
		const slug = generateSlug(data.title)

		let uniqueSlug = slug
		let counter = 0

		while (
			(await getCategoryBySlug(uniqueSlug)) &&
			counter < INITIAL_MAX_ITERATIONS
		) {
			counter++
			uniqueSlug = `${slug}-${counter}`
		}
		const newProducts = await updateProductUseCase({
			...data,
			slug: uniqueSlug
		})
		revalidatePath("/dashboard/products")
		return { error: null }
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
}
