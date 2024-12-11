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
				unit: item.product.unit as UnitKey,
				farmer: {
					id: item.product.farmer!.id,
					name: item.product.farmer!.farmName || "",
					addresses:
						item.product.farmer?.address.map((address) => ({
							id: address.id,
							fullAddress: address!.fullAddress || "",
							longitude: address.longitude,
							latitude: address.latitude,
							note: address.note || ""
						})) || [],

					contactNumber: item.product.farmer?.contactNumber || ""
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
