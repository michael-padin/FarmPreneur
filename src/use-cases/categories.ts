import { CreateCategorySchema } from "@/app/dashboard/(admin)/categories/validation"
import {
	createCategory,
	deleteCategoriesById,
	getCategories,
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

export const deleteCategoriesByIdUseCase = async (ids: string[]) => {
	await deleteCategoriesById(ids)
}

export const updateCategoryByIdUseCase = async (
	data: CreateCategorySchema & { categoryId: string }
) => {
	await updateCategoryById(data)
}
