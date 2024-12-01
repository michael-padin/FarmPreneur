"use server"
import { createProductUseCase } from "@/use-cases/products"
import { createProductSchema, CreateProductSchema } from "./validations"
import { generateSlug, INITIAL_MAX_ITERATIONS } from "@/lib/slugify"
import { getCategoryBySlug } from "@/data-access/categories"
import { getErrorMessage } from "@/lib/handle-error"
import { pusherServer } from "@/lib/pusher"
import { createNotificationsForAdminsUseCase } from "@/use-cases/notifications"

export const createProduct = async (
	data: CreateProductSchema & {
		userId: string
	}
) => {
	const parsedData = createProductSchema.safeParse(data)
	if (!parsedData.success) {
		return { error: "Invalid fields" }
	}
	try {
		const slug = generateSlug(data.title)

		let uniqueSlug = slug
		let counter = 0

		while (
			(await getCategoryBySlug(uniqueSlug)) &&
			counter < INITIAL_MAX_ITERATIONS
		) {
			counter++
			uniqueSlug = `${slug}-${counter}`
		}
		const createdProduct = await createProductUseCase({
			...data,
			slug: uniqueSlug
		})
		if (createdProduct.listingStatus === "PENDING") {
			// await pusherServer.trigger("pending-products-count", "update", {
			// 	count: await getPendingFarmerCountUseCase()
			// })

			await createNotificationsForAdminsUseCase({
				title: "Product Approval",
				message: `New product waiting for approval`,
				type: "PRODUCT_APPROVAL",
				metadata: {
					product: {
						productImage: createdProduct.images[0]?.url,
						productId: createdProduct.id,
						productName: createdProduct.title
					},
					farmer: {
						farmerId: createdProduct.farmerId!,
						farmerName: createdProduct.farmer?.farmName || ""
					}
				}
			})

			await pusherServer.trigger("pending-products", "update", {
				data: createProduct
			})
		}
		return { error: null }
	} catch (error) {
		console.error(error)
		return { error: getErrorMessage(error) }
	}
}
