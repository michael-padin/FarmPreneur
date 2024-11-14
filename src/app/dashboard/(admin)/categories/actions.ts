"use server"
import { getErrorMessage } from "@/lib/handle-error"
import { createCategorySchema, CreateCategorySchema } from "./validation"
import {
	createCategoryUseCase,
	deleteCategoriesByIdUseCase,
	updateCategoryByIdUseCase
} from "@/use-cases/categories"
import { generateSlug, INITIAL_MAX_ITERATIONS } from "@/lib/slugify"
import { getCategoryBySlug } from "@/data-access/categories"
import { revalidatePath } from "next/cache"

export const createCategory = async (data: CreateCategorySchema) => {
	const validatedFields = createCategorySchema.safeParse(data)

	if (!validatedFields.success) return { error: "Invalid 	fields!" }

	try {
		const slug = generateSlug(data.name)

		let uniqueSlug = slug
		let counter = 0

		while (
			(await getCategoryBySlug(uniqueSlug)) &&
			counter < INITIAL_MAX_ITERATIONS
		) {
			counter++
			uniqueSlug = `${slug}-${counter}`
		}
		await createCategoryUseCase({
			...data,
			slug: uniqueSlug
		})
		revalidatePath("/dashboard/categories")
		return { error: null }
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
}
export const deleteCategories = async (ids: string[]) => {
	try {
		await deleteCategoriesByIdUseCase(ids)
		revalidatePath("/dashboard/categories")
		return { error: null }
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
}

export const updateCategory = async (
	data: CreateCategorySchema & { categoryId: string }
) => {
	const validatedFields = createCategorySchema.safeParse(data)

	if (!validatedFields.success) return { error: "Invalid 	fields!" }

	try {
		await updateCategoryByIdUseCase({
			...data,
			categoryId: data.categoryId
		})
		revalidatePath("/dashboard/categories")
		return { error: null }
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
}
