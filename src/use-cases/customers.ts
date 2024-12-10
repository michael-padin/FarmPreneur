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
import { groupCartItemsByFarmer } from "@/lib/utils"

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
					pickupLocation: {
						id: product.pickupLocation!.id,
						fullAddress: product.pickupLocation!.fullAddress || "",
						latitude: product.pickupLocation!.latitude,
						longitude: product.pickupLocation!.longitude
					},
					unit: product.unit as UnitKey,
					farmer: {
						id: product.farmer!.id,
						name: product.farmer!.farmName || ""
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
		id: item.id,
		product: {
			id: item.product.id,
			name: item.product.title,
			price: item.product.price,
			image: item.product.images[0].url,
			pickupLocation: {
				id: item.product.pickupLocation!.id,
				fullAddress: item.product.pickupLocation!.fullAddress || "",
				latitude: item.product.pickupLocation!.latitude,
				longitude: item.product.pickupLocation!.longitude
			},
			unit: item.product.unit as UnitKey,
			farmer: {
				id: item.product.farmer!.id,
				name: item.product.farmer!.farmName || ""
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
