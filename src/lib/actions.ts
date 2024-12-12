"use server"

import { NewAddressCustomerSchema } from "@/app/(home)/profile/address/create/validation"
import { EditCustomerProfileSchema } from "@/app/(home)/profile/edit/validation"
import { auth } from "@/auth"
import { getProductsSuggestions } from "@/data-access/products"
import { db } from "@/lib/db"
import { CartItem, CartState } from "@/types/cart"
import {
	getFarmersUseCase,
	getPendingFarmerCountUseCase
} from "@/use-cases/farmers"
import { createNotificationByUserIdUseCase } from "@/use-cases/notifications"
import { OrderStatus, SubTrackStatus } from "@prisma/client"
import { compare, hash } from "bcryptjs"
import { revalidatePath } from "next/cache"
import { getErrorMessage } from "./handle-error"

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

export async function cancelOrder(payload: {
	orderId: string
	cancellationReason: string
	subStatus: SubTrackStatus
}) {
	const { orderId, cancellationReason } = payload

	try {
		const order = await db.order.findUnique({
			where: { id: orderId },
			include: {
				customer: true
			}
		})

		if (!order) {
			return { success: false, error: "Order not found" }
		}

		await db.order.update({
			where: { id: orderId },
			data: {
				status: "CANCELLED",
				cancellationReason,
				subStatus: "CANCELLED_BY_BUYER"
			}
		})

		revalidatePath("/dashboard/farmer/orders")
		revalidatePath("/dashboard/orders")

		return { success: true }
	} catch (error) {
		return { success: false, error: "Failed to update order status" }
	}
}

export async function changeOrderStatus(
	prevState: any,
	payload: {
		orderId: string
		status: OrderStatus
	}
): Promise<{ success: boolean; error?: string }> {
	const { orderId, status } = payload

	try {
		const order = await db.order.findUnique({
			where: { id: orderId },
			include: {
				customer: true
			}
		})

		if (!order) {
			return { success: false, error: "Order not found" }
		}

		const updatedOrder = await db.order.update({
			where: { id: orderId },
			data: {
				status,
				...(status === "IN_PROGRESS" && { subStatus: "PREPARING_PRODUCE" })
			},
			include: {
				items: { include: { product: true } },
				farmer: true,
				customer: {
					include: { user: true }
				}
			}
		})

		if (!updatedOrder) {
			return { success: false, error: "Order not found" }
		}

		if (updatedOrder.status === "IN_PROGRESS") {
			await createNotificationByUserIdUseCase({
				userId: updatedOrder.customer?.user.id || "",
				title: "Order Accepted",
				message: `Your Order from ${updatedOrder.farmer.farmName} has been accepted.`,
				type: "ORDER_STATUS",
				metadata: {
					farmer: {
						farmerId: updatedOrder.farmer.id,
						farmerName: updatedOrder.farmer.farmName!
					},
					order: {
						orderId: order.id,
						orderStatus: updatedOrder.status,
						// orderTotalPrice: updatedOrder.totalPrice,
						orderItems: updatedOrder.items.map((item) => ({
							productId: item.product.id,
							productName: item.product.title,
							quantity: item.quantity,
							price: item.price
						}))
					}
				}
			})
		}

		revalidatePath("/dashboard/farmer/orders")
		revalidatePath("/dashboard/orders")

		return { success: true }
	} catch (error) {
		return { success: false, error: getErrorMessage(error) }
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

// MARK: Customer
// edit Customer Profile
export async function updateCustomerProfile(
	payload: EditCustomerProfileSchema & {
		customerId?: string
	}
) {
	try {
		const session = await auth()
		if (!session) {
			return { error: "Unauthorized", success: false }
		}
		let customerId = payload.customerId
		if (!customerId) {
			customerId = session.user.customerId
		}

		console.log("payload :>> ", payload)

		const updatedCustomer = await db.customer.update({
			where: { id: customerId },
			data: {
				birthDate: payload.birthDate,
				name: payload.fullName,
				contactNumber: payload.contactNumber,
				gender: payload.gender,
				user: {
					update: {
						email: payload.email
					}
				}
			}
		})

		if (!updatedCustomer) {
			return { error: "Customer not found", success: false }
		}

		revalidatePath("/profile/edit")
		return { success: true, error: null }
	} catch (error) {
		return { error: getErrorMessage(error), success: false }
	}
}

// MARK: Address
export async function createCustomerAddress(
	payload: NewAddressCustomerSchema & {
		customerId?: string
	}
) {
	try {
		const session = await auth()
		if (!session) {
			return { error: "Unauthorized", success: false }
		}
		let customerId = payload.customerId
		if (!customerId) {
			customerId = session.user.customerId
		}

		const createdAddress = await db.address.create({
			data: {
				latitude: payload.address.latitude,
				longitude: payload.address.longitude,
				fullAddress: payload.address.fullAddress,
				locationType: payload.locationType,
				contactNumber: payload.contactNumber,
				contactName: payload.contactName,
				region: payload.address.region,
				country: payload.address.country,
				postalCode: payload.address.postalCode,
				street: payload.address.street,
				isDefault: payload.isDefault || false,
				customer: {
					connect: {
						id: customerId
					}
				}
			}
		})

		return { success: true, error: null }
	} catch (error) {
		return { error: getErrorMessage(error), success: false }
	}
}
export async function editCustomerAddress(
	payload: NewAddressCustomerSchema & {
		customerId?: string
		addressId: string
	}
) {
	try {
		const session = await auth()
		if (!session) {
			return { error: "Unauthorized", success: false }
		}
		let customerId = payload.customerId
		if (!customerId) {
			customerId = session.user.customerId
		}

		if (payload.isDefault === true) {
			await db.address.updateMany({
				where: { customerId },
				data: { isDefault: false }
			})
		}

		const updatedAddress = await db.address.update({
			where: {
				id: payload.addressId
			},
			data: {
				latitude: payload.address.latitude,
				longitude: payload.address.longitude,
				fullAddress: payload.address.fullAddress,
				locationType: payload.locationType,
				contactNumber: payload.contactNumber,
				contactName: payload.contactName,
				region: payload.address.region,
				country: payload.address.country,
				postalCode: payload.address.postalCode,
				street: payload.address.street,
				isDefault: payload.isDefault || false
			}
		})

		return { success: true, error: null }
	} catch (error) {
		return { error: getErrorMessage(error), success: false }
	}
}

export async function changeCustomerDefaultAddress(payload: {
	customerId?: string
	addressId: string
}) {
	try {
		const session = await auth()
		if (!session) {
			return { error: "Unauthorized", success: false }
		}
		let customerId = payload.customerId
		if (!customerId) {
			customerId = session.user.customerId
		}

		await db.address.updateMany({
			where: { customerId },
			data: { isDefault: false }
		})

		await db.address.update({
			where: { id: payload.addressId },
			data: { isDefault: true }
		})
		revalidatePath("/profile/address")
		return { error: null, success: true }
	} catch (error) {
		return { error: getErrorMessage(error), success: false }
	}
}

export async function changeUserPassword(payload: {
	customerId?: string
	userId?: string
	newPassword: string
	currentPassword: string
}) {
	const { newPassword, currentPassword } = payload
	try {
		const session = await auth()
		if (!session) {
			return { error: "Unauthorized", success: false }
		}

		const userId = payload.userId || session.user.id

		const user = await db.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				password: true
			}
		})

		if (!user) {
			return { error: "User not found", success: false }
		}

		const passwordMatch = await compare(currentPassword, user.password!)

		if (!passwordMatch) {
			return { error: "Invalid current password", success: false }
		}
		const hashedPassword = await hash(newPassword, 10)

		await db.user.update({
			where: { id: userId },
			data: { password: hashedPassword }
		})

		return { error: null, success: true }
	} catch (error) {
		return { error: getErrorMessage(error), success: false }
	}
}

export async function updateOrderSubStatus(payload: {
	orderId: string
	status: SubTrackStatus
}) {
	try {
		const order = await db.order.findUnique({
			where: { id: payload.orderId },
			include: {
				customer: {
					select: {
						id: true,
						user: {
							select: {
								id: true
							}
						}
					}
				},
				farmer: true
			}
		})

		if (!order) {
			return { error: "Order not found", success: false }
		}

		const updatedOrder = await db.order.update({
			where: { id: payload.orderId },
			data: { subStatus: payload.status },
			include: { items: { include: { product: true } } }
		})

		if (!updatedOrder) {
			return { error: "Order not found", success: false }
		}

		if (updatedOrder.subStatus === "READY_FOR_PICKUP") {
			await createNotificationByUserIdUseCase({
				userId: order.customer?.user.id || "",
				title: "Order Ready for Pickup",
				message: `Your Order from ${order.farmer.farmName} is now ready for pickup.`,
				type: "ORDER_STATUS",
				metadata: {
					farmer: {
						farmerId: order.farmer.id,
						farmerName: order.farmer.farmName!
					},
					order: {
						orderId: order.id,
						orderStatus: updatedOrder.status,
						orderSubStatus: updatedOrder.subStatus,
						// orderTotalPrice: updatedOrder.totalPrice,
						orderItems: updatedOrder.items.map((item) => ({
							productId: item.product.id,
							productName: item.product.title,
							quantity: item.quantity,
							price: item.price
						}))
					}
				}
			})
		} else if (updatedOrder.subStatus === "PICKED_UP") {
			await createNotificationByUserIdUseCase({
				userId: order.customer?.user.id || "",
				title: "Order Picked Up",
				message: `You have picked up your Order from ${order.farmer.farmName}. Please confirm your order.`,
				type: "ORDER_STATUS",
				metadata: {
					farmer: {
						farmerId: order.farmer.id,
						farmerName: order.farmer.farmName!
					},
					order: {
						orderId: order.id,
						orderStatus: updatedOrder.status,
						orderSubStatus: updatedOrder.subStatus,
						// orderTotalPrice: updatedOrder.totalPrice,
						orderItems: updatedOrder.items.map((item) => ({
							productId: item.product.id,
							productName: item.product.title,
							quantity: item.quantity,
							price: item.price
						}))
					}
				}
			})
		}

		revalidatePath("/dashboard/farmer/orders")
		revalidatePath("/orders")
		return { error: null, success: true }
	} catch (error) {
		return { error: getErrorMessage(error), success: false }
	}
}

export async function confirmPickedUpOrder(
	prevState: any,
	payload: {
		orderId: string
		status: OrderStatus
		subStatus: SubTrackStatus
	}
) {
	const { orderId, status, subStatus } = payload

	try {
		const order = await db.order.findUnique({
			where: { id: orderId },
			include: {
				customer: true
			}
		})

		if (!order) {
			return { error: "Order not found", success: false }
		}

		const updatedOrder = await db.order.update({
			where: { id: orderId },
			data: {
				status: status,
				subStatus: subStatus
			},
			include: {
				items: { include: { product: true } },
				farmer: {
					include: {
						user: {
							select: {
								id: true
							}
						}
					}
				},
				customer: true
			}
		})

		await createNotificationByUserIdUseCase({
			userId: updatedOrder.farmer?.user.id || "",
			title: "Order Completed",
			message: `${updatedOrder.customer?.name} has confirmed and completed the order from you.`,
			type: "ORDER_STATUS",
			metadata: {
				farmer: {
					farmerId: updatedOrder.farmer.id,
					farmerName: updatedOrder.farmer.farmName!
				},
				order: {
					orderId: order.id,
					orderStatus: updatedOrder.status,
					orderSubStatus: updatedOrder.subStatus || "BUYER_CONFIRMED",
					// orderTotalPrice: updatedOrder.totalPrice,
					orderItems: updatedOrder.items.map((item) => ({
						productId: item.product.id,
						productName: item.product.title,
						quantity: item.quantity,
						price: item.price
					}))
				}
			}
		})
		revalidatePath("/orders")
		revalidatePath("/dashboard/farmer/orders")
		return { error: null, success: true }
	} catch (error) {
		return { error: getErrorMessage(error), success: false }
	}
}

export async function leaveReview(payload: {
	orderId: string
	rating: number
	review: string
}) {
	const { orderId, rating, review } = payload

	try {
		// get all the product in the order items and create a new review for each product
		const order = await db.order.findUnique({
			where: { id: orderId },
			include: {
				items: {
					include: {
						product: {
							select: {
								id: true
							}
						}
					}
				}
			}
		})

		if (!order) {
			return { error: "Order not found", success: false }
		}

		const createdReviews = await Promise.all(
			order.items.map(async (item) => {
				await db.productReview.create({
					data: {
						rating: rating,
						comment: review,
						status: "PUBLISHED",
						productId: item.product.id,
						customerId: order.customerId,
						orderId: order.id,
						farmerId: order.farmerId
					}
				})
			})
		)

		revalidatePath("/orders")
		return { error: null, success: true }
	} catch (error) {
		return { error: getErrorMessage(error), success: false }
	}
}
