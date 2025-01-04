"use server"
import { notifyAdminProductListed } from "@/app/actions/notifications"
import { auth } from "@/auth"
import { getProductBySlug } from "@/data-access/products"
import { getErrorMessage } from "@/lib/handle-error"
import { generateSlug, INITIAL_MAX_ITERATIONS } from "@/lib/slugify"
import { createProductUseCase } from "@/use-cases/products"
import { createProductSchema, CreateProductSchema } from "./validations"

export const createProduct = async (data: CreateProductSchema) => {
	const parsedData = createProductSchema.safeParse(data)
	if (!parsedData.success) {
		return { error: "Invalid fields" }
	}
	try {
		const session = await auth()

		if (!session?.user) {
			return { error: "Unauthorized" }
		}
		const userId = session.user.id || ""
		const slug = generateSlug(data.title)

		let uniqueSlug = slug
		let counter = 0

		while (
			(await getProductBySlug(uniqueSlug)) &&
			counter < INITIAL_MAX_ITERATIONS
		) {
			counter++
			uniqueSlug = `${slug}-${counter}`
		}
		const createdProduct = await createProductUseCase({
			...data,
			userId,
			slug: uniqueSlug
		})

		if (!createdProduct) {
			return { error: "Failed to create product" }
		}

		await notifyAdminProductListed(
			createdProduct.id,
			createdProduct.listingStatus
		)
		return { error: null }
	} catch (error) {
		console.error(error)
		return { error: getErrorMessage(error) }
	}
}
