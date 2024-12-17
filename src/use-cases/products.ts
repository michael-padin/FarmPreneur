import { ProductSort } from "@/app/(home)/products/(list)/searchParams"
import { UpdateProductSchema } from "@/app/dashboard/(admin)/products/[id]/edit/validations"
import { createProductFromAdmin } from "@/app/dashboard/(admin)/products/create/actions"
import { CreateProductSchema } from "@/app/dashboard/(admin)/products/create/validations"
import { CreateProductSchema as CreateProductSchemaFarmer } from "@/app/dashboard/farmer/products/create/validations"
import { auth } from "@/auth"
import { UnitKey } from "@/constants/unit"
import { getFarmerByUserId } from "@/data-access/farmers"
import {
	createProduct,
	deleteProductsById,
	getAllProducts,
	getDailyProducts,
	getPendingProducts,
	getProductById,
	getProductBySlug,
	getProductReviewStats,
	getProducts,
	getProductsOnProductListPage,
	getTopProducts,
	getTopSellingProducts,
	getTotalProducts,
	getTotalProductsByDate,
	updateProduct
} from "@/data-access/products"
import { Address, ProductListingStatus } from "@prisma/client"

export const createProductUseCase = async (
	data: CreateProductSchemaFarmer & { userId: string; slug: string }
) => {
	try {
		const farmer = await getFarmerByUserId(data.userId)

		if (!farmer) {
			throw new Error("No farmer found!")
		}
		const createdProduct = await createProduct({
			...data,
			farmerId: farmer.id
		})
		return {
			...createdProduct,
			farmer
		}
	} catch (error) {
		throw error
	}
}

export const getProductByIdUseCase = async (id: string) => {
	const foundProduct = await getProductById(id)

	if (!foundProduct) throw new Error("Product not found")

	return {
		id: foundProduct.id,
		categoryId: foundProduct.categoryId || "",
		title: foundProduct.title,
		slug: foundProduct.slug || "",
		description: foundProduct.description,
		farmerId: foundProduct.farmerId || "",
		listingStatus: foundProduct.listingStatus,
		price: foundProduct.price,
		unit: (foundProduct.unit as UnitKey) || "kg",
		quantity: foundProduct.quantity,
		productImages:
			foundProduct?.productImages.map((url) => ({
				id: Math.random().toString(36).substring(7),
				url: url || "",
				type: "image" as "image" | "video",
				file: null
			})) || []
	}
}

export const getProductByIdFromFarmerUseCase = async (id: string) => {
	const foundProduct = await getProductById(id)

	if (!foundProduct) throw new Error("Product not found")

	return {
		userId: foundProduct.farmer?.user.id,
		id: foundProduct.id,
		categoryId: foundProduct.categoryId || "",
		title: foundProduct.title,
		description: foundProduct.description,
		price: foundProduct.price,
		unit: (foundProduct.unit as UnitKey) || "kg",
		quantity: foundProduct.quantity,
		productImages:
			foundProduct?.productImages.map((url) => ({
				id: Math.random().toString(36).substring(7),
				url: url || "",
				type: "image" as "image" | "video",
				file: null
			})) || []
	}
}

export const getAllProductsUseCase = async () => {
	return getAllProducts()
}

export const deleteProductsByIdUseCase = async (ids: string[]) => {
	return deleteProductsById(ids)
}

export const getTopProductsUseCase = async (limit = 10) => {
	try {
		return await getTopProducts(limit)
	} catch (error) {
		throw error
	}
}

export const getTotalProductsUseCase = async (userId?: string) => {
	const currentDate = new Date()
	const lastMonthDate = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth() - 1,
		1
	)
	try {
		const totalProducts = await getTotalProducts(userId)
		const increaseChange =
			totalProducts - (await getTotalProductsByDate(lastMonthDate))
		return { totalProducts, increaseChange }
	} catch (error) {
		throw error
	}
}

export const getProductReviewStatsUseCase = async () => {
	try {
		return await getProductReviewStats()
	} catch (error) {
		throw error
	}
}

export const getTopSellingProductsUseCase = async (limit = 10) => {
	try {
		return await getTopSellingProducts(limit)
	} catch (error) {
		throw error
	}
}

export const getPendingProductsUseCase = async () => {
	try {
		return await getPendingProducts()
	} catch (error) {
		throw error
	}
}

// FARMER QUERIES HERE
export const getProductsUseCase = async (filter: {
	status: ProductListingStatus | null
	search: string | null
}) => {
	const session = await auth()
	if (!session || !session.user) throw new Error("Unauthorized")

	return await getProducts({
		search: filter.search!,
		status: filter.status,
		userId: session.user.id!
	})
}

// this query is on the product list page
export const getProductsOnProductListPageUseCase = async (filter: {
	search?: string
	sortBy?: ProductSort
}) => {
	const products = await getProductsOnProductListPage({
		search: filter.search,
		sortBy: filter.sortBy
	})

	const shapedProducts = products.map((product) => {
		const totalSold = product.orderItem
			.filter((orderItem) => orderItem.order.status === "COMPLETED")
			.reduce((sum, item) => sum + item.quantity, 0)
		const averageRating =
			product.reviews.reduce((sum, review) => sum + review.rating, 0) /
				product.reviews.length || 0
		return {
			...product,
			totalSold,
			averageRating
		}
	})

	return shapedProducts
}

export const getDailyProductsUseCase = async (address?: Address) => {
	const dailyProducts = await getDailyProducts()

	const products = dailyProducts.map((product) => {
		const totalSold = product.orderItem
			.filter((orderItem) => orderItem.order.status === "COMPLETED")
			.reduce((sum, item) => sum + item.quantity, 0)
		const averageRating =
			product.reviews.reduce((sum, review) => sum + review.rating, 0) /
				product.reviews.length || 0
		return {
			...product,
			totalSold,
			averageRating
		}
	})

	return products
}

// MARK: MUTATIONS
export const createProductFromAdminUseCase = async (
	data: CreateProductSchema & { slug: string }
) => {
	return await createProductFromAdmin(data)
}

export const getProductBySlugUseCase = async (slug: string) => {
	if (!slug) throw new Error("No slug provided")

	const product = await getProductBySlug(slug)

	if (!product) throw new Error("Product not found")

	const averageRating =
		product.reviews.reduce((sum, review) => sum + review.rating, 0) /
			product.reviews.length || 0
	const totalSold = product.orderItem
		.filter((orderItem) => orderItem.order.status === "COMPLETED")
		.reduce((sum, item) => sum + item.quantity, 0)

	return {
		id: product.id,
		price: product.price,
		unit: product.unit as UnitKey,
		title: product.title,
		description: product.description,
		quantity: product.quantity,
		averageRating,
		totalSold: totalSold,
		_count: {
			orders: product._count.orderItem
		},
		productImages: product?.productImages || [],
		farmer: {
			id: product.farmer?.id || "",
			name: product.farmer?.farmName || product.farmer?.user.name || "",
			contactNumber: product.farmer?.contactNumber || "",
			addresses:
				product.farmer?.address.map((address) => ({
					id: address.id,
					fullAddress: address.fullAddress || "",
					longitude: address.longitude,
					latitude: address.latitude,
					note: address.note || ""
				})) || []
		}
	}
}

export const updateProductUseCase = async (
	data: UpdateProductSchema & { productId: string; slug: string }
) => {
	return await updateProduct(data)
}
