import { CreateCategorySchema } from "@/app/dashboard/(admin)/categories/validation"
import {
	deleteCategoriesById,
	updateCategoryById
} from "@/data-access/categories"

export const deleteCategoriesByIdUseCase = async (ids: string[]) => {
	await deleteCategoriesById(ids)
}

export const updateCategoryByIdUseCase = async (
	data: CreateCategorySchema & { categoryId: string }
) => {
	await updateCategoryById(data)
}
