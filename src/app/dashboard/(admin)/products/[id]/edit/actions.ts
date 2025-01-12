"use server"
import { notifyFarmerProductListed } from "@/app/actions/notifications"
import { getCategoryBySlug } from "@/data-access/categories"
import { getErrorMessage } from "@/lib/handle-error"
import { generateSlug, INITIAL_MAX_ITERATIONS } from "@/lib/slugify"
import {
	getProductByIdUseCase,
	updateProductUseCase
} from "@/use-cases/products"
import { revalidatePath } from "next/cache"
import { updateProductSchema, UpdateProductSchema } from "./validations"

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

		const existingProduct = await getProductByIdUseCase(data.productId)

		if (!existingProduct) {
			return { error: "Product not found" }
		}

		let uniqueSlug = slug
		let counter = 0

		if (data.title !== existingProduct.title) {
			uniqueSlug = existingProduct.slug || ""
		} else {
			while (
				(await getCategoryBySlug(uniqueSlug)) &&
				counter < INITIAL_MAX_ITERATIONS
			) {
				counter++
				uniqueSlug = `${slug}-${counter}`
			}
		}

		const updatedProduct = await updateProductUseCase({
			...data,
			slug: uniqueSlug
		})

		if (
			existingProduct.listingStatus === "PENDING" &&
			updatedProduct.listingStatus === "APPROVED"
		) {
			await notifyFarmerProductListed(
				updatedProduct.id,
				updatedProduct.listingStatus
			)
		}

		revalidatePath("/dashboard/products")
		return { error: null }
	} catch (error) {
		console.log("error :>> ", error)
		return { error: getErrorMessage(error) }
	}
}
