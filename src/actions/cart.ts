"use server"
import { auth } from "@/auth"
import { getCart } from "@/data-access/cart"
import { db } from "@/lib/db"
import { CartFarmer, CartItem, CartState } from "@/types/cart"
import { revalidatePath } from "next/cache"

export async function getCartServerFunction(
	customerId: string
): Promise<CartState> {
	if (!customerId) {
		return {
			farmers: [],
			totalItems: 0,
			total: 0,
			distinctProductsCount: 0
		}
	}

	const cartItems = await getCart(customerId)

	const cartItemsByFarmer = (): CartState => {
		const farmersMap: Record<string, CartFarmer> = {}
		let totalItems = 0
		let total = 0

		for (const item of cartItems) {
			const farmer = item.product.farmer
			const farmerId = farmer!.id

			if (!farmersMap[farmerId]) {
				farmersMap[farmerId] = {
					farmer: {
						id: farmerId,
						name: farmer!.farmName!
					},
					items: []
				}
			}

			farmersMap[farmerId].items.push({
				id: item.id,
				product: {
					id: item.productId,
					name: item.product.title,
					price: item.product.price,
					image: item.product.images[0].url,
					unit: item.product.unit!
				},
				quantity: item.quantity
			})

			totalItems += item.quantity
			total += item.quantity * item.product.price
		}

		const farmers = Object.values(farmersMap)

		return {
			farmers,
			totalItems,
			total,
			distinctProductsCount: farmers.reduce(
				(sum, farmer) => sum + farmer.items.length,
				0
			)
		}
	}

	return cartItemsByFarmer()
}

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
	const customerId = session.user.customerId

	try {
		const product = await db.product.findUnique({
			where: { id: productId },
			include: { cartItems: true }
		})

		const currentQuantity = product?.cartItems.find(
			(cartItem) => cartItem.customerId === customerId
		)?.quantity

		if (currentQuantity && currentQuantity + quantity > product.quantity) {
			return {
				success: false,
				error: "You can't add more than the available stock"
			}
		}

		await db.cartItem.upsert({
			where: {
				customerId_productId: {
					customerId,
					productId
				}
			},
			update: {
				quantity: { increment: quantity }
			},
			create: {
				quantity,
				productId,
				customerId
			},
			include: {
				product: {
					include: { images: true }
				}
			}
		})

		revalidatePath("/")
		return { success: true }
	} catch (error) {
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
