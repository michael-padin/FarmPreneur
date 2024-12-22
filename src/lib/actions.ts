"use server"

import { NewAddressCustomerSchema } from "@/app/(home)/profile/address/create/validation"
import { EditCustomerProfileSchema } from "@/app/(home)/profile/edit/validation"
import { EditProductSchema } from "@/app/dashboard/farmer/products/[id]/edit/validations"
import { EditFarmerAddressSchema } from "@/app/dashboard/farmer/profile/address/[id]/edit/validation"
import { EditFarmerProfileSchema } from "@/app/dashboard/farmer/profile/edit/validation"
import { auth } from "@/auth"
import { getFarmerByUserId } from "@/data-access/farmers"
import { markAllNotificationsAsRead } from "@/data-access/notifications"
import { getProductsSuggestions } from "@/data-access/products"
import { db } from "@/lib/db"
import { CartItem, CartState } from "@/types/cart"
import {
	getFarmersUseCase,
	getPendingFarmerCountUseCase
} from "@/use-cases/farmers"
import { createNotificationByUserIdUseCase } from "@/use-cases/notifications"
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { NotificationType, OrderStatus, OrderSubStatus } from "@prisma/client"
import { compare, hash } from "bcryptjs"
import { revalidatePath } from "next/cache"
import { verifyCustomerSession } from "./dal"
import { getErrorMessage } from "./handle-error"
import { s3Client } from "./s3-client"

// MARK: NOTIFICATIONS
export const markNotificationsAsRead = async (userId?: string) => {
	try {
		const session = await auth()

		const finalUserId = session?.user.id || userId

		if (!finalUserId) {
			return { success: false, error: "Unauthorized" }
		}

		await markAllNotificationsAsRead(finalUserId)
		revalidatePath("/notifications")
		revalidatePath("/dashboard/farmer/notifications")
		revalidatePath("/dashboard/notifications")

		return { success: true, error: null }
	} catch (error) {
		return { success: false, error: getErrorMessage(error) }
	}
}

export const markNotificationAsRead = async (notificationId: string) => {
	try {
		await db.notification.update({
			where: {
				id: notificationId
			},
			data: {
				isRead: true
			}
		})
		revalidatePath("/notifications")
		revalidatePath("/dashboard/farmer/notifications")
		revalidatePath("/dashboard/notifications")
		return { success: true, error: null }
	} catch (error) {
		return { success: false, error: getErrorMessage(error) }
	}
}

export const revalidatePathFromNotifications = async (
	type: NotificationType
) => {
	switch (type) {
		case "ORDER_STATUS":
			revalidatePath("/dashboard/orders")
			revalidatePath("/dashboard/farmer/orders")
			revalidatePath("/orders")
			break
		case "FARMER_APPROVAL":
			revalidatePath("/dashboard/farmer/notifications")
			revalidatePath("/dashboard/farmer/analytics")
			break
		case "PRODUCT_APPROVAL":
			revalidatePath("/dashboard/products")
			revalidatePath("/dashboard/farmer/products")
			break
		case "NEW_MESSAGE":
			revalidatePath("/messages")
			break
		case "NEW_PRODUCT":
			revalidatePath("/dashboard/products")
			revalidatePath("/dashboard/farmer/products")
			break
	}
}

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

	const { cartId } = await verifyCustomerSession()

	try {
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
		customerContactId: string
		checkoutData: CartState
	}
): Promise<{ success: boolean; error?: string }> {
	const { checkoutData, customerContactId } = payload
	try {
		const session = await auth()

		if (!session || !session.user) {
			return { success: false, error: "Unauthorized" }
		}

		const customerId = session.user.customerId
		const foundCustomer = await db.customer.findUnique({
			where: {
				id: customerId
			}
		})

		if (!foundCustomer) {
			return { error: "Customer not found", success: false }
		}
		// Create orders and validate stock

		await db.$transaction(async (tx) => {
			for (const group of checkoutData.groupedItems) {
				const foundUserFarmer = await tx.user.findFirst({
					where: {
						farmer: {
							id: group.farmer.id
						}
					}
				})

				if (!foundUserFarmer) {
					throw new Error(`Farmer with ID ${group.farmer.id} not found`)
				}

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

				const foundCustomerContact = await tx.address.findFirst({
					where: {
						id: customerContactId
					}
				})

				const createdOrderCustomerContact = await tx.address.create({
					data: {
						contactName: foundCustomerContact?.contactName || "",
						contactNumber: foundCustomerContact?.contactNumber || "",
						fullAddress: foundCustomerContact?.fullAddress || "",
						latitude: foundCustomerContact?.latitude || 0,
						longitude: foundCustomerContact?.longitude || 0,
						country: foundCustomerContact?.country || "",
						region: foundCustomerContact?.region || "",
						label: "Customer Contact",
						note: foundCustomerContact?.note || "",
						street: foundCustomerContact?.street || "",
						locationType: "CustomerContact",
						postalCode: foundCustomerContact?.postalCode || "",
						isDefault: false
					}
				})

				// Create the order
				const createdOrder = await tx.order.create({
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
						customerContactId: createdOrderCustomerContact.id,
						status: "PENDING",
						subStatus: "AWAITING_FARMER_ACCEPTANCE",
						pickupLocationId: group.pickupLocationId
					},
					include: {
						items: {
							include: { product: true }
						}
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

				await createNotificationByUserIdUseCase({
					userId: foundUserFarmer.id || "",
					title: "New Order Received",
					message: `You have a new order from ${foundCustomer.name}. The order includes: ${group.items.map((item) => `${item.quantity}x ${item.product.name}`).join(", ")}.`,
					type: "ORDER_STATUS",
					metadata: {
						farmer: {
							farmerId: group.farmer.id,
							farmerName: group.farmer.name!
						},
						order: {
							orderId: createdOrder.id,
							orderStatus: createdOrder.status,
							orderSubStatus: createdOrder.subStatus,
							orderItems: createdOrder.items.map((item) => ({
								productId: item.product.id,
								productName: item.product.title,
								quantity: item.quantity,
								price: item.price
							}))
						}
					}
				})
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
	subStatus: OrderSubStatus
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
				subStatus: payload.subStatus
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

export const editProduct = async (
	data: EditProductSchema & {
		productId: string
		farmerId?: string
	}
) => {
	try {
		const session = await auth()
		if (!session) {
			throw new Error("Unauthorized")
		}
		const userId = session.user.id || ""
		const farmer = await getFarmerByUserId(userId)

		if (!farmer) {
			throw new Error("No farmer found!")
		}
		const updatedProduct = await db.product.update({
			where: { id: data.productId },
			data: {
				title: data.title,
				description: data.description,
				price: data.price,
				quantity: data.quantity,
				category: {
					connect: {
						id: data.categoryId
					}
				},
				productImages: { set: data.images.map((image) => image.url) },
				unit: data.unit
			}
		})

		if (!updatedProduct) {
			return { error: "Product not found", success: false }
		}
		return { error: null, success: true }
	} catch (error) {
		return { error: getErrorMessage(error), success: false }
	}
}

// MARK: Customer
// edit Customer Profile
export async function updateCustomerProfile(
	data: EditCustomerProfileSchema & {
		customerId?: string
		newCoverPhoto?: string
		newProfilePicture?: string
	}
) {
	try {
		const session = await auth()
		if (!session) {
			return { error: "Unauthorized", success: false }
		}
		let customerId = data.customerId
		if (!customerId) {
			customerId = session.user.customerId
		}

		const updatedCustomer = await db.customer.update({
			where: { id: customerId },
			data: {
				bio: data.bio,
				birthDate: data.birthDate,
				name: data.fullName,
				contactNumber: data.contactNumber,
				gender: data.gender,
				coverPhoto: { set: data.newCoverPhoto },
				profilePicture: { set: data.newProfilePicture },
				user: {
					update: {
						email: data.email
					}
				}
			}
		})

		if (!updatedCustomer) {
			return { error: "Customer not found", success: false }
		}

		revalidatePath("/profile")
		return { success: true, error: null }
	} catch (error) {
		return { error: getErrorMessage(error), success: false }
	}
}
// MARK: Farmer
export const updateFarmerProfile = async (
	data: EditFarmerProfileSchema & {
		farmerId?: string
		newCoverPhoto?: string
		newProfilePicture?: string
	}
) => {
	try {
		const session = await auth()
		let farmerId = data.farmerId
		if (!farmerId) {
			farmerId = session?.user.farmerId
		}

		if (!farmerId) {
			return { error: "No farmer found", success: false }
		}

		const updatedFarmer = await db.farmer.update({
			where: { id: farmerId },
			data: {
				farmName: data.farmerName,
				farmDescription: data.farmDescription,
				coverPhoto: { set: data.newCoverPhoto },
				profilePicture: { set: data.newProfilePicture },
				gender: data.gender,
				contactNumber: data.contactNumber
			}
		})
		if (!updatedFarmer) {
			return { error: "Farmer not found", success: false }
		}
		revalidatePath("/dashboard/farmer/profile")
		return { success: true, error: null }
	} catch (error) {
		return { error: getErrorMessage(error), success: false }
	}
}

// MARK: Address
export async function createCustomerAddress(
	data: NewAddressCustomerSchema & {
		customerId?: string
	}
) {
	try {
		const session = await auth()
		if (!session) {
			return { error: "Unauthorized", success: false }
		}
		let customerId = data.customerId
		if (!customerId) {
			customerId = session.user.customerId
		}

		await db.address.create({
			data: {
				label: data.label,
				latitude: data.address.latitude,
				longitude: data.address.longitude,
				fullAddress: data.address.fullAddress,
				locationType: data.label,
				note: data.note,
				contactNumber: data.contactNumber,
				contactName: data.contactName,
				region: data.address.region,
				country: data.address.country,
				postalCode: data.address.postalCode,
				street: data.address.street,
				isDefault: data.isDefault || false,
				customer: {
					connect: {
						id: customerId
					}
				}
			}
		})

		revalidatePath("/profile/address")
		revalidatePath("/checkout")
		return { success: true, error: null }
	} catch (error) {
		return { error: getErrorMessage(error), success: false }
	}
}
export async function editCustomerAddress(
	data: NewAddressCustomerSchema & {
		customerId?: string
		addressId: string
	}
) {
	try {
		const session = await auth()
		if (!session) {
			return { error: "Unauthorized", success: false }
		}
		let customerId = data.customerId
		if (!customerId) {
			customerId = session.user.customerId
		}

		if (data.isDefault === true) {
			await db.address.updateMany({
				where: { customerId },
				data: { isDefault: false }
			})
		}

		await db.address.update({
			where: {
				id: data.addressId
			},
			data: {
				latitude: data.address.latitude,
				longitude: data.address.longitude,
				fullAddress: data.address.fullAddress,
				label: data.label,
				note: data.note,
				contactNumber: data.contactNumber,
				contactName: data.contactName,
				region: data.address.region,
				country: data.address.country,
				postalCode: data.address.postalCode,
				street: data.address.street,
				isDefault: data.isDefault || false
			}
		})
		revalidatePath("/profile/address")
		revalidatePath("/checkout")
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

export const editFarmerAddress = async (
	data: EditFarmerAddressSchema & {
		addressId: string
	}
) => {
	try {
		const session = await auth()
		if (!session) {
			throw new Error("Unauthorized")
		}
		let farmerId = session.user.farmerId
		if (!farmerId) {
			farmerId = session.user.farmerId
		}

		await db.address.update({
			where: {
				id: data.addressId
			},
			data: {
				note: data.note,
				contactNumber: data.contactNumber,
				contactName: data.contactName,
				locationType: "FarmAddress",
				label: "Farm Address",
				isDefault: true,

				latitude: data.address.latitude,
				longitude: data.address.longitude,
				fullAddress: data.address.fullAddress,
				region: data.address.region,
				country: data.address.country,
				postalCode: data.address.postalCode,
				street: data.address.street
			}
		})

		return { success: true, error: null }
	} catch (error) {
		return { success: false, error: getErrorMessage(error) }
	}
}

export const deleteAddress = async (addressId: string) => {
	try {
		const session = await auth()
		if (!session) {
			return { error: "Unauthorized", success: false }
		}

		await db.address.delete({
			where: {
				id: addressId
			}
		})

		revalidatePath("/profile/address")
		revalidatePath("/checkout")
		revalidatePath("/dashboard/farmer/profile/address")
		return { success: true, error: null }
	} catch (error) {
		return { success: false, error: getErrorMessage(error) }
	}
}
// MARK: CHANGE PASSWWORD
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
	status: OrderSubStatus
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

		revalidatePath("/dashboard/farmer/orders?status=IN_PROGRESS")
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
		subStatus: OrderSubStatus
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
		revalidatePath("/orders?status=IN_PROGRESS")
		return { error: null, success: true }
	} catch (error) {
		return { error: getErrorMessage(error), success: false }
	}
}

export async function rateOrder(payload: {
	orderId: string
	ratings: {
		rate: number
		review?: string
		images: string[]
		productId: string
	}[]
}) {
	const { orderId, ratings } = payload

	try {
		// get all the product in the order items and create a new review for each product
		const order = await db.order.findUnique({
			where: { id: orderId },
			include: {
				items: {
					select: {
						productId: true
					}
				}
			}
		})

		if (!order) {
			return { error: "Order not found", success: false }
		}

		await db.$transaction(async (tx) => {
			await Promise.all(
				ratings.map(async (rating) => {
					await tx.productReview.create({
						data: {
							images: rating.images,
							rating: rating.rate,
							comment: rating.review,
							status: "PUBLISHED",
							productId: rating.productId,
							customerId: order.customerId
						}
					})
				})
			)

			await tx.order.update({
				where: { id: orderId },
				data: {
					status: "COMPLETED",
					subStatus: "BUYER_REVIEWED"
				}
			})
		})

		revalidatePath("/orders?status=COMPLETED")
		return { error: null, success: true }
	} catch (error) {
		return { error: getErrorMessage(error), success: false }
	}
}

export async function uploadMedia(payload: {
	userId?: string
	file: File | null
	path: string
}) {
	const { userId, file, path } = payload
	if (file) {
		const fileName = `${path}/${crypto.randomUUID()}-${file.name}`
		const putObjectCommand = new PutObjectCommand({
			Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
			Key: fileName,
			ContentType: file.type
		})

		const uploadUrl = await getSignedUrl(s3Client, putObjectCommand, {
			expiresIn: 60
		})

		await fetch(uploadUrl, {
			method: "PUT",
			body: file,
			headers: {
				"Content-Type": file.type
			}
		})

		const newMediaUrl = `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_DOMAIN}/${fileName}`
		return newMediaUrl
	}
}

export async function deleteMedia(url: string) {
	// Create a new URL object
	const parsedUrl = new URL(url)

	// Extract the pathname and decode it
	const key = decodeURIComponent(parsedUrl.pathname.slice(1)) // Removes the leading slash

	const deleteCommand = new DeleteObjectCommand({
		Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
		Key: key
	})
	await s3Client.send(deleteCommand)
}
