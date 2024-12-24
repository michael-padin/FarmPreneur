import { CreateCategorySchema } from "@/app/dashboard/(admin)/categories/validation"
import { verifyAdminSession } from "@/lib/dal"
import { db } from "@/lib/db"

export const getCategories = async () => {
	return await db.category.findMany({
		include: {
			_count: {
				select: {
					products: true
				}
			}
		}
	})
}

export const createCategory = async (
	data: CreateCategorySchema & { slug: string }
) => {
	await verifyAdminSession()
	return await db.category.create({
		data: {
			name: data.name,
			description: data.description,
			slug: data.slug,
			image: data.image?.url
		}
	})
}

export const getCountCategories = async (productIds: string[]) => {
	return await db.category.count({
		where: {
			products: {
				some: {
					id: { in: productIds }
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

export const deleteCategories = async (ids: string[]) => {
	await verifyAdminSession()

	return await db.$transaction([
		db.category.deleteMany({ where: { id: { in: ids } } })
	])
}

export const updateCategory = async (
	data: CreateCategorySchema & { categoryId: string }
) => {
	await verifyAdminSession()

	return await db.category.update({
		where: { id: data.categoryId },
		data: {
			name: data.name,
			description: data.description,
			image: data.image?.url
		}
	})
}
