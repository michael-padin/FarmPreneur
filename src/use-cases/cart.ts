"use server"

import { getCart } from "@/data-access/cart"

export const getCartUseCase = async (customerId: string) => {
	return await getCart(customerId)
}
