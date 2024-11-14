import { CreateCategorySchema } from "@/app/dashboard/(admin)/categories/validation"
import {
	createCategory,
	deleteCategoriesById,
	getCategories,
	getCategoryBySlug,
	updateCategoryById
} from "@/data-access/categories"

export const getCategoriesUseCase = async () => {
	return await getCategories()
}

export const createCategoryUseCase = async (
	data: CreateCategorySchema & { slug: string }
) => {
	await createCategory(data)
}

export const getCategoryBySlugUseCase = async (slug: string) => {
	return getCategoryBySlug(slug)
}

export const deleteCategoriesByIdUseCase = async (ids: string[]) => {
	await deleteCategoriesById(ids)
}

export const updateCategoryByIdUseCase = async (
	data: CreateCategorySchema & { categoryId: string }
) => {
	await updateCategoryById(data)
}
