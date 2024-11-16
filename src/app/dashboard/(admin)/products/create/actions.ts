"use server"
import { createProductSchema, CreateProductSchema } from "./validations"
import { revalidatePath } from "next/cache"
import { generateSlug, INITIAL_MAX_ITERATIONS } from "@/lib/slugify"
import { getCategoryBySlug } from "@/data-access/categories"
import { createProductFromAdminUseCase } from "@/use-cases/products"
import { getErrorMessage } from "@/lib/handle-error"

export const createProductFromAdmin = async (data: CreateProductSchema) => {
	const validatedFields = createProductSchema.safeParse(data)
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
		const newProducts = await createProductFromAdminUseCase({
			...data,
			slug: uniqueSlug
		})
		revalidatePath("/dashboard/products")
		return { error: null }
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
}
