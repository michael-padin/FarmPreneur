"use server"
import { generateSlug, INITIAL_MAX_ITERATIONS } from "@/lib/slugify"
import { updateProductSchema, UpdateProductSchema } from "./validations"
import { getCategoryBySlug } from "@/data-access/categories"
import { revalidatePath } from "next/cache"
import { getErrorMessage } from "@/lib/handle-error"
import {
	getProductByIdUseCase,
	updateProductUseCase
} from "@/use-cases/products"
import {
	createNotificationByUserIdUseCase,
	createNotificationsForAdminsUseCase
} from "@/use-cases/notifications"
import { pusherServer } from "@/lib/pusher"
import { createNotificationByUserId } from "@/data-access/notifications"

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
			// await pusherServer.trigger("pending-products-count", "update", {
			// 	count: await getPendingFarmerCountUseCase()
			// })
			const userId = updatedProduct.farmer?.user.id || ""

			await createNotificationByUserIdUseCase({
				userId,
				title: "Product Approval Update",
				message: `Product ${updatedProduct.title} has been approved.`,
				type: "PRODUCT_APPROVAL",
				metadata: {
					product: {
						productImage: updatedProduct.images[0]?.url,
						productId: updatedProduct.id,
						productName: updatedProduct.title,
						productListingStatus: updatedProduct.listingStatus
					}
				}
			})
		}

		revalidatePath("/dashboard/products")
		return { error: null }
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
}
