"use server"
import { auth } from "@/auth"
import { UnitKey } from "@/constants/unit"
import { getCart } from "@/data-access/cart"
import { db } from "@/lib/db"
import { CartItem, CartState } from "@/types/cart"
import { revalidatePath } from "next/cache"

export async function getCartServerFunction(
	customerId: string
): Promise<CartState> {
	if (!customerId) {
		return {
			items: [],
			totalItems: 0,
			total: 0,
			distinctProductsCount: 0
		}
	}

	const cartItems = await getCart(customerId)

	const shapedCartItems = cartItems.map((item) => ({
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

	const totalItems = shapedCartItems.reduce(
		(sum, item) => sum + item.quantity,
		0
	)
	const total = shapedCartItems.reduce(
		(sum, item) => sum + item.quantity * item.product.price,
		0
	)

	const distinctProductsCount = shapedCartItems.length

	return {
		items: shapedCartItems,
		totalItems,
		total,
		distinctProductsCount
	}
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
