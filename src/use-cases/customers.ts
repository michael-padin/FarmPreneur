import { EditUserSchema } from "@/app/dashboard/(admin)/users/[id]/edit/validations"
import { auth } from "@/auth"
import { UnitKey } from "@/constants/unit"
import { getCartById } from "@/data-access/cart"
import {
	getCustomerById,
	getCustomers,
	updateCustomerByUserId
} from "@/data-access/customers"
import { getProductById } from "@/data-access/products"
import { db } from "@/lib/db"
import { groupCartItemsByFarmer } from "@/lib/utils"

export const getCustomerProfileUseCase = async () => {
	const session = await auth()

	if (!session || !session.user) throw new Error("Unauthorized")

	const customerId = session.user.customerId || ""

	const customer = await getCustomerById(customerId)
	if (!customer) throw new Error("Customer not found!")

	const customerQuery = await db.customer.findUnique({
		where: {
			id: customerId
		},
		include: {
			_count: {
				select: {
					address: true,
					orders: true,
					reviews: true
				}
			},

			user: {
				select: {
					id: true,
					email: true,
					createdAt: true,
					profilePicture: {
						select: {
							url: true
						}
					}
				}
			},
			reviews: true,
			address: true
		}
	})

	return {
		bio: customerQuery?.bio || "",
		userId: customerQuery?.user.id || "",
		name: customerQuery?.name || "",
		email: customerQuery?.user.email || "",
		address: {
			fullAddress: customerQuery?.address?.[0]?.fullAddress || "",
			latitude: customerQuery?.address?.[0]?.latitude || 0,
			longitude: customerQuery?.address?.[0]?.longitude || 0
		},
		birthDate: customerQuery?.birthDate || "",
		gender: customerQuery?.gender,
		coverPhoto: customerQuery?.coverPhoto
			? {
					id: Math.random().toString(36).substring(7),
					url: customerQuery?.coverPhoto || "",
					type: "image" as "image" | "video",
					file: null
				}
			: null,
		profilePicture: customerQuery?.profilePicture
			? {
					id: Math.random().toString(36).substring(7),
					url: customerQuery?.profilePicture || "",
					type: "image" as "image" | "video",
					file: null
				}
			: null,
		contactNumber: customerQuery?.contactNumber || "",
		orders: customerQuery?._count.orders,
		reviews: customerQuery?._count.reviews,
		createdAt: customerQuery?.createdAt
	}
}

export const getCustomersUseCase = async () => {
	return await getCustomers()
}

export const updateCustomerByUserIdUseCase = async (
	data: EditUserSchema & {
		userId: string
	}
) => {
	return await updateCustomerByUserId(data)
}

export const createCustomerUseCase = async (
	data: EditUserSchema & {
		userId: string
	}
) => {
	return await updateCustomerByUserId(data)
}

export const getCheckoutDataUseCase = async (
	productId?: string,
	quantity?: number
) => {
	const session = await auth()

	if (!session || !session.user) {
		throw new Error("Unauthorized!")
	}

	if (productId && quantity) {
		const product = await getProductById(productId)

		if (!product) {
			throw new Error("Product not found!")
		}

		const items = [
			{
				id: product.id,
				product: {
					id: product.id,
					name: product.title,
					price: product.price,
					image: product.images[0].url,
					unit: product.unit as UnitKey,
					farmer: {
						id: product.farmer!.id,
						name: product.farmer!.farmName || "",
						contactNumber: product.farmer!.contactNumber || "",
						addresses:
							product.farmer?.address.map((address) => ({
								id: address.id,
								fullAddress: address.fullAddress || "",
								longitude: address.longitude,
								latitude: address.latitude,
								note: address.note || ""
							})) || []
					}
				},
				quantity
			}
		]

		const totalItems = items.reduce((sum, item) => sum + item.quantity, 0) || 0
		const total =
			items.reduce(
				(sum, item) => sum + item.quantity * item.product.price,
				0
			) || 0
		const distinctProductsCount = items.length || 0

		return {
			items,
			groupedItems: groupCartItemsByFarmer(items),
			totalItems,
			total,
			distinctProductsCount
		}
	}

	const customerId = session.user.customerId || ""
	const cartId = session.user.cartId || ""

	const customer = await getCustomerById(customerId)

	if (!customer) {
		throw new Error("Customer not found!")
	}

	const cart = await getCartById(cartId)

	if (!cart) {
		throw new Error("Cart not found!")
	}

	const reshapedCart = cart.items.map((item) => ({
		id: item.product.id,
		product: {
			id: item.product.id,
			name: item.product.title,
			price: item.product.price,
			image: item.product.images[0].url,
			unit: item.product.unit as UnitKey,
			farmer: {
				id: item.product.farmer!.id,
				name: item.product.farmer!.farmName || "",
				contactNumber: item.product.farmer!.contactNumber || "",
				addresses:
					item.product.farmer?.address.map((address) => ({
						id: address.id,
						fullAddress: address.fullAddress || "",
						longitude: address.longitude,
						latitude: address.latitude,
						note: address.note || ""
					})) || []
			}
		},
		quantity: item.quantity
	}))

	const totalItems =
		reshapedCart.reduce((sum, item) => sum + item.quantity, 0) || 0
	const total =
		reshapedCart.reduce(
			(sum, item) => sum + item.quantity * item.product.price,
			0
		) || 0
	const distinctProductsCount = reshapedCart.length || 0

	return {
		items: reshapedCart,
		groupedItems: groupCartItemsByFarmer(reshapedCart),
		total,
		totalItems,
		distinctProductsCount
	}
}
