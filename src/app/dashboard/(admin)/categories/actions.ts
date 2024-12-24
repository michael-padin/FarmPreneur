"use server"
import {
	createCategory,
	getCategoryBySlug,
	updateCategory
} from "@/data-access/categories"
import { getErrorMessage } from "@/lib/handle-error"
import { generateSlug, INITIAL_MAX_ITERATIONS } from "@/lib/slugify"
import { revalidatePath } from "next/cache"
import { createCategorySchema, CreateCategorySchema } from "./validation"

export const createCategoryAction = async (data: CreateCategorySchema) => {
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
		await createCategory({
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
		await deleteCategories(ids)
		revalidatePath("/dashboard/categories")
		return { error: null }
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
}

export const updateCategoryAction = async (
	data: CreateCategorySchema & { categoryId: string }
) => {
	const validatedFields = createCategorySchema.safeParse(data)

	if (!validatedFields.success) return { error: "Invalid 	fields!" }

	try {
		await updateCategory({
			...data,
			categoryId: data.categoryId
		})
		revalidatePath("/dashboard/categories")
		return { error: null }
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
}
