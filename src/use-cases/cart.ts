"use server"

import { UnitKey } from "@/constants/unit"
import { getCartById } from "@/data-access/cart"
import { groupCartItemsByFarmer } from "@/lib/utils"
import { CartState } from "@/types/cart"

export const getCartUseCase = async (cartId: string): Promise<CartState> => {
	if (!cartId) {
		return {
			items: [],
			groupedItems: [],
			totalItems: 0,
			total: 0,
			distinctProductsCount: 0
		}
	}

	const cart = await getCartById(cartId)
	const reshapedCart = cart!.items.map((item) => {
		return {
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
		}
	})
	const totalItems =
		cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0
	const total =
		cart?.items.reduce(
			(sum, item) => sum + item.quantity * item.product.price,
			0
		) || 0
	const groupedItems = groupCartItemsByFarmer(reshapedCart)
	const distinctProductsCount = reshapedCart?.length || 0

	return {
		items: reshapedCart,
		groupedItems,
		totalItems,
		total,
		distinctProductsCount
	}
}
