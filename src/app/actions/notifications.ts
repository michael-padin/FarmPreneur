"use server"

import { FarmerApprovedEmail } from "@/components/fp/email/fp-approved-email"
import { FarmerRejectedEmail } from "@/components/fp/email/fp-farmer-rejected-email"
import { NewMessageEmail } from "@/components/fp/email/fp-new-message-email"
import { NewOrderEmail } from "@/components/fp/email/fp-new-order-email"
import { OrderCancelledEmail } from "@/components/fp/email/fp-order-cancelled-email"
import { OrderStatusUpdateEmail } from "@/components/fp/email/fp-order-status-update-email"
import { ProductApprovalEmail } from "@/components/fp/email/fp-product-approval-email"
import { ProductExpiredEmail } from "@/components/fp/email/fp-product-expired-email"
import { ProductOutOfStockEmail } from "@/components/fp/email/fp-product-out-of-stock-email"
import { ProductRejectedEmail } from "@/components/fp/email/fp-product-rejected-email"
import { verifySession } from "@/lib/dal"
import { db } from "@/lib/db"
import { sendNotification } from "@/utils/notification-helper"
import {
	FarmerApplicationStatus,
	NotificationType,
	OrderStatus,
	OrderSubStatus,
	ProductListingStatus
} from "@prisma/client"
import { PushSubscription } from "web-push"

export async function notifyFarmerApproval(
	farmerId: string,
	approved: boolean
) {
	const farmer = await db.farmer.findUnique({
		where: { id: farmerId },
		include: { user: true }
	})
	if (!farmer) throw new Error("Farmer not found")

	const newStatus = approved
		? FarmerApplicationStatus.APPROVED
		: FarmerApplicationStatus.REJECTED

	await db.farmer.update({
		where: { id: farmerId },
		data: { applicationStatus: newStatus }
	})

	if (approved) {
		await sendNotification(farmer.userId, NotificationType.FARMER_APPROVAL, {
			email: {
				subject: "Welcome to FarmPreneur - Your application has been approved!",
				component: FarmerApprovedEmail({
					farmerName: farmer.name || "",
					farmName: farmer.farmName || "",
					dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`
				})
			},
			sms: `Congratulations ${farmer.name}! Your FarmPreneur application for ${farmer.farmName} has been approved. Log in to your dashboard to get started.`,
			push: {
				title: "FarmPreneur Application Approved!",
				body: `Congratulations! Your application for ${farmer.farmName} has been approved.`,
				icon: "/web-app-manifest-192x192.png",
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`
			}
		})
	} else {
		// Handle rejection notifications
		await sendNotification(farmer.userId, NotificationType.FARMER_APPROVAL, {
			email: {
				subject: "FarmPreneur Application Status Update",
				component: FarmerRejectedEmail({
					farmerName: farmer.name || "",
					farmName: farmer.farmName || "",
					rejectionReason:
						"Your application did not meet our current criteria.",
					supportUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/support`
				})
			},
			sms: `We regret to inform you that your FarmPreneur application for ${farmer.farmName} has not been approved at this time. Please check your email for more details.`,
			push: {
				title: "FarmPreneur Application Update",
				body: `Your application for ${farmer.farmName} has not been approved. Please check your email for more information.`,
				icon: "/web-app-manifest-192x192.png",
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/support`
			}
		})
	}
}

export async function notifyProductListed(
	productId: string,
	status: ProductListingStatus,
	reason?: string
) {
	const product = await db.product.findUnique({
		where: { id: productId },
		include: { farmer: { include: { user: true } } }
	})

	if (!product || !product.farmer)
		throw new Error("Product or Farmer not found")

	await db.product.update({
		where: { id: productId },
		data: { listingStatus: status }
	})

	if (status === ProductListingStatus.APPROVED) {
		await sendNotification(
			product.farmer.userId,
			NotificationType.PRODUCT_APPROVAL,
			{
				email: {
					subject: `Your product ${product.title} has been approved!`,
					component: ProductApprovalEmail({
						farmerName: product.farmer.name || "",
						productName: product.title,
						dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/products/${product.id}`
					})
				},
				sms: `Great news! Your product "${product.title}" has been approved and is now listed on FarmPreneur.`,
				push: {
					title: "Product Approved!",
					body: `Your product "${product.title}" is now listed on FarmPreneur.`,
					icon: "/web-app-manifest-192x192.png",
					url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/products/${product.id}`
				}
			}
		)
	} else if (status === ProductListingStatus.REJECTED) {
		await sendNotification(
			product.farmer.userId,
			NotificationType.PRODUCT_APPROVAL,
			{
				email: {
					subject: `Your product ${product.title} has not been approved`,
					component: ProductRejectedEmail({
						farmerName: product.farmer.name || "",
						productName: product.title,
						rejectionReason: reason || "No specific reason provided",
						dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/products/${product.id}`
					})
				},
				sms: `Your product "${product.title}" was not approved for listing. Please check your email for more details.`,
				push: {
					title: "Product Not Approved",
					body: `Your product "${product.title}" was not approved for listing. Please check your email for more details.`,
					icon: "/web-app-manifest-192x192.png",
					url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/products/${product.id}`
				}
			}
		)
	}
}

export async function notifyNewOrder(orderId: string) {
	const order = await db.order.findUnique({
		where: { id: orderId },
		include: {
			items: {
				include: { product: true }
			},
			farmer: { include: { user: true } },
			customer: { include: { user: true } }
		}
	})

	if (!order || !order.farmer || !order.customer)
		throw new Error("Order, Farmer, or Customer not found")

	const orderItems = order.items
		.map((item) => `${item.quantity}x ${item.product.title}`)
		.join(", ")
	const orderTotal = order.totalPrice || 0

	// Notify Farmer
	await sendNotification(order.farmer.userId, NotificationType.ORDER_STATUS, {
		email: {
			subject: `New order received: #${order.id}`,
			component: NewOrderEmail({
				farmerName: order.farmer.farmName || "",
				orderNumber: order.id,
				orderItems: orderItems,
				orderTotal: `₱${orderTotal.toFixed(2)}`,
				dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/orders/${order.id}`
			})
		},
		sms: `New order #${order.id} received! Total: ₱${orderTotal.toFixed(2)}. Check your dashboard for details.`,
		push: {
			title: "New Order Received!",
			body: `Order #${order.id} - Total:  ₱${orderTotal.toFixed(2)}`,
			icon: "/web-app-manifest-192x192.png",
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/orders/${order.id}`
		}
	})

	// Notify Customer
	await sendNotification(order.customer.userId, NotificationType.ORDER_STATUS, {
		email: {
			subject: `Order #${order.id} Received`,
			component: OrderStatusUpdateEmail({
				customerName: order.customer.name || "",
				orderNumber: order.id,
				newStatus: OrderStatus.PENDING,
				statusDescription:
					"Your order has been received and is being processed.",
				dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order.id}`
			})
		},
		sms: `Your order #${order.id} has been received and is being processed. Total: ₱${orderTotal.toFixed(2)}`,
		push: {
			title: "Order Received",
			body: `Your order #${order.id} has been received and is being processed.`,
			icon: "/web-app-manifest-192x192.png",
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order.id}`
		}
	})
}

export async function notifyOrderStatusUpdate(
	orderId: string,
	newStatus: OrderStatus,
	newSubStatus: OrderSubStatus,
	reason?: string
) {
	const order = await db.order.findUnique({
		where: { id: orderId },
		include: {
			customer: { include: { user: true } },
			farmer: { include: { user: true } }
		}
	})

	if (!order || !order.customer || !order.farmer)
		throw new Error("Order, Customer, or Farmer not found")

	await db.order.update({
		where: { id: orderId },
		data: {
			status: newStatus,
			subStatus: newSubStatus
		}
	})

	await db.orderStatusHistory.create({
		data: {
			orderId,
			status: newStatus,
			reason,
			updatedByUserId: order.farmer.userId // Assuming the farmer is updating the status
		}
	})

	let statusDescription = ""
	switch (newSubStatus) {
		case OrderSubStatus.AWAITING_FARMER_ACCEPTANCE:
			statusDescription = "Your order is awaiting acceptance by the farmer."
			break
		case OrderSubStatus.PREPARING_PRODUCE:
			statusDescription = "The farmer is now preparing your order."
			break
		case OrderSubStatus.READY_FOR_PICKUP:
			statusDescription = "Your order is ready for pickup."
			break
		case OrderSubStatus.PICKED_UP:
			statusDescription = "Your order has been picked up."
			break
		case OrderSubStatus.PAYMENT_PROCESSED:
			statusDescription = "Payment for your order has been processed."
			break
		case OrderSubStatus.BUYER_CONFIRMED:
			statusDescription = "You have confirmed receipt of your order."
			break
		case OrderSubStatus.FULLY_SETTLED:
			statusDescription = "Your order has been fully settled."
			break
		case OrderSubStatus.BUYER_REVIEWED:
			statusDescription =
				"You have reviewed your order. Thank you for your feedback!"
			break
		case OrderSubStatus.CANCELLED_BY_FARMER:
			statusDescription = `Your order has been cancelled by the farmer. Reason: ${reason || "No reason provided"}`
			break
		case OrderSubStatus.CANCELLED_BY_BUYER:
			statusDescription = "You have cancelled your order."
			break
		case OrderSubStatus.INSUFFICIENT_STOCK:
			statusDescription =
				"Your order has been cancelled due to insufficient stock."
			break
		case OrderSubStatus.PAYMENT_FAILED:
			statusDescription =
				"Your order has been cancelled due to payment failure."
			break
		case OrderSubStatus.QUALITY_ISSUES:
			statusDescription = "Your order has been cancelled due to quality issues."
			break
		default:
			statusDescription = `Your order status has been updated to ${newSubStatus}.`
	}

	await sendNotification(order.customer.userId, NotificationType.ORDER_STATUS, {
		email: {
			subject: `Order #${order.id} status update: ${newStatus}`,
			component: OrderStatusUpdateEmail({
				customerName: order.customer.name || "",
				orderNumber: order.id,
				newStatus: newStatus,
				statusDescription: statusDescription,
				dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order.id}`
			})
		},
		sms: `Order #${order.id} update: ${newStatus}. ${statusDescription}`,
		push: {
			title: `Order #${order.id} Update`,
			body: `Status: ${newStatus}. ${statusDescription}`,
			icon: "/web-app-manifest-192x192.png",
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order.id}`
		}
	})

	if (
		newStatus === OrderStatus.CANCELLED ||
		newStatus === OrderStatus.COMPLETED
	) {
		await sendNotification(order.farmer.userId, NotificationType.ORDER_STATUS, {
			email: {
				subject: `Order #${order.id} ${newStatus}`,
				component: OrderStatusUpdateEmail({
					customerName: order.farmer.name || "",
					orderNumber: order.id,
					newStatus: newStatus,
					statusDescription: `Order #${order.id} has been ${newStatus.toLowerCase()}.`,
					dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/orders/${order.id}`
				})
			},
			sms: `Order #${order.id} has been ${newStatus.toLowerCase()}.`,
			push: {
				title: `Order #${order.id} ${newStatus}`,
				body: `Order #${order.id} has been ${newStatus.toLowerCase()}.`,
				icon: "/web-app-manifest-192x192.png",
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/orders/${order.id}`
			}
		})
	}
}

export async function notifyNewMessage(messageId: string) {
	const message = await db.message.findUnique({
		where: { id: messageId },
		include: {
			sender: true,
			conversation: {
				include: {
					participants: {
						include: {
							user: true
						}
					}
				}
			},
			attachment: true
		}
	})

	if (!message) throw new Error("Message not found")

	// Find the recipient (the participant who is not the sender)
	const recipient = message.conversation.participants.find(
		(participant) => participant.userId !== message.senderId
	)

	if (!recipient) throw new Error("Recipient not found")

	// Fetch sender's name from customer or farmer model
	// Fetch sender's and recipient's names
	const senderName = await getUserName(message.senderId)
	const recipientName = await getUserName(recipient.userId)

	// Prepare attachment info if present
	let attachmentInfo = ""
	if (message.attachment) {
		attachmentInfo = `[Attachment: ${message.attachment.type}]`
	}

	// Prepare message preview
	const messagePreview = `${message.content.substring(0, 97)}${message.content.length > 97 ? "..." : ""}`

	await sendNotification(recipient.userId, NotificationType.NEW_MESSAGE, {
		email: {
			subject: `New message from ${senderName} on FarmPreneur`,
			component: NewMessageEmail({
				recipientName,
				senderName,
				messagePreview: `${messagePreview} ${attachmentInfo}`,
				dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/conversations/${message.conversationId}`
			})
		},
		sms: `New message from ${senderName} on FarmPreneur: "${messagePreview}" ${attachmentInfo}. Check your dashboard to view and reply.`,
		push: {
			title: "New Message",
			body: `${senderName}: ${messagePreview} ${attachmentInfo}`,
			icon: "/web-app-manifest-192x192.png",
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/conversations/${message.conversationId}`
		}
	})
}

async function getUserName(userId: string): Promise<string> {
	const farmer = await db.farmer.findUnique({
		where: { userId: userId },
		select: { farmName: true, name: true }
	})

	if (farmer) return farmer.farmName! || farmer.name!

	const customer = await db.customer.findUnique({
		where: { userId: userId },
		select: { name: true }
	})

	if (customer) return customer.name!

	// If neither farmer nor customer is found, fall back to the user's name
	const user = await db.user.findUnique({
		where: { id: userId },
		select: { name: true }
	})

	return user ? user.name! : "Unknown User"
}

export async function notifyOrderCancelled(orderId: string, reason: string) {
	const order = await db.order.findUnique({
		where: { id: orderId },
		include: {
			customer: { include: { user: true } },
			farmer: { include: { user: true } }
		}
	})

	if (!order || !order.customer || !order.farmer)
		throw new Error("Order, Customer, or Farmer not found")

	await db.order.update({
		where: { id: orderId },
		data: {
			status: OrderStatus.CANCELLED,
			subStatus: OrderSubStatus.CANCELLED_BY_FARMER,
			cancellationReason: reason
		}
	})

	await sendNotification(order.customer.userId, NotificationType.ORDER_STATUS, {
		email: {
			subject: `Order #${order.id} has been cancelled`,
			component: OrderCancelledEmail({
				customerName: order.customer.name || "",
				orderNumber: order.id,
				cancellationReason: reason,
				dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order.id}`
			})
		},
		sms: `Your order #${order.id} has been cancelled. Reason: ${reason}`,
		push: {
			title: "Order Cancelled",
			body: `Your order #${order.id} has been cancelled. Reason: ${reason}`,
			icon: "/web-app-manifest-192x192.png",
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order.id}`
		}
	})

	await sendNotification(order.farmer.userId, NotificationType.ORDER_STATUS, {
		email: {
			subject: `Order #${order.id} has been cancelled`,
			component: OrderCancelledEmail({
				customerName: order.farmer.name || "",
				orderNumber: order.id,
				cancellationReason: reason,
				dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/orders/${order.id}`
			})
		},
		sms: `Order #${order.id} has been cancelled. Reason: ${reason}`,
		push: {
			title: "Order Cancelled",
			body: `Order #${order.id} has been cancelled. Reason: ${reason}`,
			icon: "/web-app-manifest-192x192.png",
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/orders/${order.id}`
		}
	})
}

export async function notifyProductExpired(productId: string) {
	const product = await db.product.findUnique({
		where: { id: productId },
		include: { farmer: { include: { user: true } } }
	})

	if (!product || !product.farmer)
		throw new Error("Product or Farmer not found")

	await db.product.update({
		where: { id: productId },
		data: { listingStatus: ProductListingStatus.EXPIRED }
	})

	await sendNotification(product.farmer.userId, NotificationType.SYSTEM_ALERT, {
		email: {
			subject: `Your product ${product.title} has expired`,
			component: ProductExpiredEmail({
				farmerName: product.farmer.name || "",
				productName: product.title,
				expirationDate: new Date().toLocaleDateString(),
				dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/products/${product.id}`
			})
		},
		sms: `Your product "${product.title}" has expired and is no longer visible on the FarmPreneur marketplace. Please update or relist if necessary.`,
		push: {
			title: "Product Expired",
			body: `Your product "${product.title}" has expired. Please update or relist if necessary.`,
			icon: "/web-app-manifest-192x192.png",
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/products/${product.id}`
		}
	})
}

export async function notifyProductOutOfStock(productId: string) {
	const product = await db.product.findUnique({
		where: { id: productId },
		include: { farmer: { include: { user: true } } }
	})

	if (!product || !product.farmer)
		throw new Error("Product or Farmer not found")

	await db.product.update({
		where: { id: productId },
		data: { listingStatus: ProductListingStatus.OUT_OF_STOCK }
	})

	await sendNotification(product.farmer.userId, NotificationType.SYSTEM_ALERT, {
		email: {
			subject: `Your product ${product.title} is out of stock`,
			component: ProductOutOfStockEmail({
				farmerName: product.farmer.name || "",
				productName: product.title,
				dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/products/${product.id}`
			})
		},
		sms: `Your product "${product.title}" is out of stock on FarmPreneur. Please update your inventory as soon as possible.`,
		push: {
			title: "Product Out of Stock",
			body: `Your product "${product.title}" is out of stock. Please update your inventory.`,
			icon: "/web-app-manifest-192x192.png",
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/products/${product.id}`
		}
	})
}

export async function updateNotificationPreferences(data: {
	userId: string
	preferences: {
		email: boolean
		push: boolean
		sms: boolean
	}
}) {
	try {
		await db.notificationPreference.upsert({
			where: { userId: data.userId },
			update: data.preferences,
			create: { userId: data.userId, ...data.preferences }
		})
		return { success: true, message: "Preferences updated successfully" }
	} catch (error) {
		console.error("Error updating preferences:", error)
		return { success: false, message: "Failed to update preferences" }
	}
}

export async function subscribeUser(sub: PushSubscription) {
	const { userId } = await verifySession()
	await db.pushSubscription.upsert({
		where: { userId: userId },
		update: {
			endpoint: sub.endpoint,
			p256dh: sub.keys.p256dh,
			auth: sub.keys.auth
		},
		create: {
			userId: userId,
			endpoint: sub.endpoint,
			p256dh: sub.keys.p256dh,
			auth: sub.keys.auth
		}
	})
	return { success: true, message: "Push subscription saved successfully" }
}

export async function unsubscribeUser(endpoint: string) {
	await db.pushSubscription.delete({
		where: {
			endpoint: endpoint
		}
	})
	return { success: true, message: "Push subscription removed successfully" }
}
