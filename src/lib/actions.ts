"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { CartItem } from "@/types/cart"
import {
	getFarmersUseCase,
	getPendingFarmerCountUseCase
} from "@/use-cases/farmers"
import { revalidatePath } from "next/cache"

export const getPendingFarmerCount = async () => {
	return await getPendingFarmerCountUseCase()
}

export const getFarmers = async () => {
	return await getFarmersUseCase()
}

//MARK: CART
export async function addToCart(
	prevState: any,
	payload: {
		productId: string
		quantity: number
	}
): Promise<{ success: boolean; cartItem?: CartItem; error?: string }> {
	const { productId, quantity } = payload

	console.log("payload :>> ", payload)

	const session = await auth()

	if (!session || !session.user.customerId) {
		return { success: false, error: "You must be logged in to add to cart" }
	}
	const customerId = session.user.customerId

	let cartId = session.user.cartId

	try {
		if (!cartId && customerId) {
			const createdCart = await db.cart.create({
				data: {
					customer: {
						connect: {
							id: customerId
						}
					}
				},
				select: {
					id: true
				}
			})
			cartId = createdCart.id
		}
		const product = await db.product.findUnique({
			where: { id: productId },
			include: {
				cartItems: {
					include: { cart: true }
				}
			}
		})

		const currentQuantity = product?.cartItems.find(
			(cartItem) => cartItem.productId === productId
		)?.quantity

		if (currentQuantity && currentQuantity + quantity > product.quantity) {
			return {
				success: false,
				error: "You can't add more than the available stock"
			}
		}

		const cart = await db.cart.findUnique({
			where: {
				id: cartId
			},
			include: {
				items: {
					include: {
						product: true
					}
				}
			}
		})

		if (!cart) {
			return { error: "No cart found", success: false }
		}

		const cartItem = cart?.items.find((item) => item.product.id === productId)

		if (cartItem) {
			await db.cartItem.update({
				where: {
					id: cartItem.id
				},
				data: {
					quantity: { increment: quantity }
				}
			})
		} else {
			await db.cartItem.create({
				data: { quantity, productId: payload.productId, cartId }
			})
		}

		revalidatePath("/")
		return { success: true }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Failed to add item to cart" }
	}
}

export async function updateItemQuantity(
	prevState: any,
	payload: {
		id: string
		quantity: number
	}
): Promise<{ success: boolean; error?: string }> {
	const { id, quantity } = payload

	if (!id) {
		return { success: false, error: "No id provided" }
	}

	try {
		const cart = await db.cartItem.findUnique({
			where: { id },
			include: {
				product: {
					select: {
						quantity: true
					}
				}
			}
		})

		if (!cart) {
			return { success: false, error: "Cart item not found" }
		}

		if (quantity === 0) {
			await db.cartItem.delete({
				where: { id }
			})
		} else {
			if (quantity > cart.product.quantity) {
				return { success: false, error: "Quantity exceeds available stock" }
			}
			await db.cartItem.update({
				where: { id },
				data: { quantity },
				include: {
					product: {
						include: { images: true }
					}
				}
			})
		}
		revalidatePath("/cart")
		return { success: true }
	} catch (error) {
		console.log(error)
		return {
			success: false,
			error: "Failed to update item in cart"
		}
	}
}

export async function removeFromCart(
	prevState: any,
	id: string
): Promise<void> {
	await db.cartItem.delete({
		where: { id }
	})

	revalidatePath("/cart")
}
// MARK: END OF CART
