import { CreateCategorySchema } from "@/app/dashboard/(admin)/categories/validation"
import { db } from "@/lib/db"

export const getCategories = async () => {
	return await db.category.findMany({
		include: {
			_count: {
				select: {
					products: true
				}
			},
			image: true
		}
	})
}

export const createCategory = async (
	data: CreateCategorySchema & { slug: string }
) => {
	return await db.category.create({
		data: {
			name: data.name,
			description: data.description,
			slug: data.slug,
			image: {
				create: {
					url: data.image.url,
					filename: data.image.filename,
					size: data.image.size,
					mimeType: data.image.mimeType,
					type: "CATEGORY"
				}
			}
		}
	})
}

export const getCategoryBySlug = async (slug: string) => {
	return await db.category.findUnique({
		where: { slug }
	})
}

export const deleteCategoriesById = async (ids: string[]) => {
	return await db.$transaction([
		db.category.deleteMany({ where: { id: { in: ids } } })
	])
}

export const updateCategoryById = async (
	data: CreateCategorySchema & { categoryId: string }
) => {
	return await db.category.update({
		where: { id: data.categoryId },
		data: {
			name: data.name,
			description: data.description,
			image: {
				update: {
					url: data.image.url,
					filename: data.image.filename,
					size: data.image.size,
					mimeType: data.image.mimeType
				}
			}
		}
	})
}
