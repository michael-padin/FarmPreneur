"use server"
import { createProductUseCase } from "@/use-cases/products"
import { createProductSchema, CreateProductSchema } from "./validations"
import { generateSlug, INITIAL_MAX_ITERATIONS } from "@/lib/slugify"
import { getProductBySlug } from "@/data-access/products"
import { getErrorMessage } from "@/lib/handle-error"
import { pusherServer } from "@/lib/pusher"
import { createNotificationsForAdminsUseCase } from "@/use-cases/notifications"
import { auth } from "@/auth"

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
