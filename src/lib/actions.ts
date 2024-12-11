"use server"

import { auth } from "@/auth"
import { getProductsSuggestions } from "@/data-access/products"
import { db } from "@/lib/db"
import { CartItem, CartState } from "@/types/cart"
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

	const session = await auth()

	if (!session || !session.user.customerId) {
		return { success: false, error: "You must be logged in to add to cart" }
	}

	const cartId = session.user.cartId

	try {
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

// MARK: ORDER
export async function placeOrder(
	prevState: any,
	payload: {
		checkoutData: CartState
	}
): Promise<{ success: boolean; error?: string }> {
	const { checkoutData } = payload
	try {
		const session = await auth()

		if (!session || !session.user)
			return { success: false, error: "Unauthorized" }
		const customerId = session.user.customerId

		await db.$transaction(async (tx) => {
			// Create orders and validate stock
			for (const group of checkoutData.groupedItems) {
				for (const item of group.items) {
					// Fetch the current product stock
					const product = await tx.product.findUnique({
						where: { id: item.product.id },
						select: { quantity: true, title: true }
					})

					if (!product) {
						throw new Error(`Product with ID ${item.product.id} not found`)
					}

					// Check if the ordered quantity exceeds available stock
					if (item.quantity > product.quantity) {
						throw new Error(
							`Insufficient stock for ${product.title}. Available: ${product.quantity}, Requested: ${item.quantity}`
						)
					}
				}

				// Create the order
				await tx.order.create({
					data: {
						customerId,
						farmerId: group.farmer.id,
						totalPrice: checkoutData.total,
						items: {
							create: group.items.map((item) => ({
								productId: item.product.id,
								quantity: Number(item.quantity),
								price: item.product.price
							}))
						},
						status: "PENDING",
						pickupLocationId: group.pickupLocationId
					}
				})

				// Update product quantities
				for (const item of group.items) {
					await tx.product.update({
						where: { id: item.product.id },
						data: {
							quantity: {
								decrement: Number(item.quantity) // Reduce stock
							}
						}
					})
				}
			}
		})

		return { success: true }
	} catch (error: any) {
		console.error(error.message)
		return { success: false, error: error.message || "Failed to create order" }
	}
}

// MARK: PRODUCTS
export async function searchProducts(searchTerm: string) {
	if (!searchTerm) {
		return {
			products: []
		}
	}

	try {
		const products = await getProductsSuggestions({
			search: searchTerm
		})
		return { products }
	} catch (error) {
		console.error(error)
		return { products: [] }
	}
}
