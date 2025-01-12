"use server"

import AdminNotificationEmail from "@/components/fp/email/fp-admin-notification-email"
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
import { getErrorMessage } from "@/lib/handle-error"
import { sendNotification } from "@/utils/notification-helper"
import {
	Message,
	NotificationType,
	OrderStatus,
	OrderSubStatus,
	ProductListingStatus,
	ROLE
} from "@prisma/client"
import { revalidatePath } from "next/cache"
import { PushSubscription } from "web-push"

export async function notifyFarmerApproval(
	farmerId: string,
	approved: boolean,
	rejectionReason?: string
) {
	const farmer = await db.farmer.findUnique({
		where: { id: farmerId },
		include: { user: true }
	})
	if (!farmer) throw new Error("Farmer not found")

	if (approved) {
		await sendNotification(farmer.userId, NotificationType.FARMER_APPROVAL, {
			email: {
				subject: "Welcome to FarmPreneur - Your application has been approved!",
				component: FarmerApprovedEmail({
					farmerName: farmer.name || "",
					farmName: farmer.farmName || "",
					dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/farmer/application-status`
				})
			},
			sms: `Congratulations ${farmer.name}! Your FarmPreneur application for ${farmer.farmName} has been approved. Log in to your dashboard to get started.`,
			push: {
				title: "FarmPreneur Application Approved!",
				body: `Congratulations! Your application for ${farmer.farmName} has been approved. You can now list your products and start selling them.`,
				icon: "/web-app-manifest-192x192.png",
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/farmer/application-status`
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
						rejectionReason ||
						"Your application did not meet our current criteria.",
					supportUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/farmer/application-status`
				})
			},
			sms: `We regret to inform you that your FarmPreneur application for ${farmer.farmName} has not been approved at this time. Please check your email for more details.`,
			push: {
				title: "FarmPreneur Application Update",
				body: `Your application for ${farmer.farmName} has not been approved.  Reason: ${rejectionReason}`,
				icon: "/web-app-manifest-192x192.png",
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/farmer/application-status`
			}
		})
	}
}

export async function notifyFarmerProductListed(
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
				actionPrompt: "No further action required at this time.",
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
			farmer: { include: { user: true } },
			items: { include: { product: true } },
			customerContact: true
		}
	})

	if (!order || !order.customer || !order.farmer)
		throw new Error("Order, Customer, or Farmer not found")

	// await db.order.update({
	// 	where: { id: orderId },
	// 	data: {
	// 		status: newStatus,
	// 		subStatus: newSubStatus
	// 	}
	// })

	// await db.orderStatusHistory.create({
	// 	data: {
	// 		orderId,
	// 		status: newStatus,
	// 		reason,
	// 		updatedByUserId: order.farmer.userId // Assuming the farmer is updating the status
	// 	}
	// })

	let statusDescription = ""
	let actionPrompt = ""

	switch (newSubStatus) {
		case OrderSubStatus.ORDER_PLACED:
			statusDescription = `Your order has been placed successfully!`
			actionPrompt = "You will be notified once the farmer accepts your order."
			break
		case OrderSubStatus.ORDER_ACCEPTED:
			statusDescription = "The farmer has accepted your order"
			actionPrompt = "Please be ready to pick up the produce when notified."
			break
		case OrderSubStatus.PREPARING_PRODUCE:
			statusDescription =
				"The farmer is now preparing your order. You will be notified once the produce is ready for pickup."
			actionPrompt = "Please wait for further updates."
			break
		case OrderSubStatus.PRODUCE_READY_FOR_PICKUP:
			statusDescription = "Your order is ready for pickup."
			actionPrompt = "Please collect your order at the specified location."
			break
		case OrderSubStatus.PICKED_UP_BY_BUYER:
			statusDescription = "Your order has been picked up by you."
			actionPrompt = "Please confirm the order in your dashboard."
			break
		case OrderSubStatus.PAYMENT_PENDING:
			statusDescription = "Payment is pending for your order."
			actionPrompt = "Please complete the payment to proceed."
			break
		case OrderSubStatus.PAYMENT_PROCESSED:
			statusDescription = "Payment for your order has been processed."
			actionPrompt = "No further action required."
			break
		case OrderSubStatus.BUYER_CONFIRMED_ORDER:
			statusDescription = "You have confirmed receipt of your order."
			actionPrompt = "Thank you for confirming. Feel free to leave a review"
			break
		case OrderSubStatus.BUYER_REVIEWED:
			statusDescription =
				"You have reviewed your order. Thank you for your feedback!"
			actionPrompt = "We appreciate your input."
			break
		case OrderSubStatus.FULLY_SETTLED:
			statusDescription = "Your order has been fully settled and completed."
			actionPrompt = "Thank you for using our service."
			break
		case OrderSubStatus.ORDER_COMPLETED:
			statusDescription = "Your order has been completed."
			actionPrompt = "No further action required."
			break
		case OrderSubStatus.ORDER_REJECTED:
			statusDescription = `Your order has been rejected by the farmer. Reason: ${
				reason || "No reason provided"
			}`
			actionPrompt = "You may place a new order or contact the farmer."
			break
		case OrderSubStatus.INSUFFICIENT_STOCK:
			statusDescription =
				"Your order has been cancelled due to insufficient stock."
			actionPrompt = "You may place a new order or explore other options."
			break
		case OrderSubStatus.PAYMENT_FAILED:
			statusDescription =
				"Your order has been cancelled due to payment failure."
			actionPrompt = "Please check your payment details and try again."
			break
		case OrderSubStatus.QUALITY_ISSUES:
			statusDescription = "Your order has been cancelled due to quality issues."
			actionPrompt = "You may place a new order or contact support."
			break
		case OrderSubStatus.NO_SHOW_AT_PICKUP:
			statusDescription = "The buyer did not show up for the pickup."
			actionPrompt = "Please contact the farmer to resolve the issue."
			break
		case OrderSubStatus.PICKUP_DELAYED:
			statusDescription =
				"Pickup has been delayed due to unforeseen circumstances."
			actionPrompt = "Please wait for updated instructions."
			break
		default:
			statusDescription = `Your order status has been updated to ${newSubStatus}.`
			actionPrompt = "Please check your dashboard for more details."
	}

	// Send notification to the customer
	await sendNotification(order.customer.userId, NotificationType.ORDER_STATUS, {
		email: {
			subject: `Order #${order.id} Status Update: ${newStatus}`,
			component: OrderStatusUpdateEmail({
				customerName: order.customer.name || "",
				orderNumber: order.id,
				newStatus: newStatus,
				statusDescription: statusDescription,
				actionPrompt: actionPrompt,
				// price: order.totalPrice,
				// items: order.items
				// 	.map((item) => `${item.product.title} (x${item.quantity})`)
				// 	.join(", "),
				dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order.id}`
			})
		},
		sms: `Order #${order.id} update: ${statusDescription}. Price: ₱${order.totalPrice}. ${actionPrompt}`,
		push: {
			title: `Order Update`,
			body: `${statusDescription}.\nDetails:\n- Order #: ${order.id}\n- Price: ₱${order.totalPrice}\n- Items: ${order.items.map(
				(item) => `${item.product.title} (x${item.quantity})`
			)}`,
			icon: "/web-app-manifest-192x192.png",
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order.id}`
		}
	})

	// Notify the farmer for newly placed orders
	if (newSubStatus === OrderSubStatus.ORDER_PLACED) {
		const orderItems = order.items
			.map((item) => `${item.quantity}x ${item.product.title}`)
			.join(", ")
		await sendNotification(order.farmer.userId, NotificationType.ORDER_STATUS, {
			email: {
				subject: `New Order Placed: #${order.id}`,
				component: NewOrderEmail({
					customerName: order.customer.name || "",
					farmerName: order.farmer.name || "",
					orderNumber: order.id,
					orderItems: orderItems,
					orderTotal: `₱${order.totalPrice?.toFixed(2)}`,
					actionPrompt: "Please review and accept the order in your dashboard.",
					dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/orders/${order.id}`
				})
			},
			sms: `New Order placed by ${order.customer.name}. Price: ${order.totalPrice}, Items: ${orderItems}. Please review it in your dashboard.`,
			push: {
				title: `New Order`,
				body: `A new order has been placed by ${order.customer.name}. Order #: ${order.id}, Price: ₱${order.totalPrice}, Items: ${order.items
					.map((item) => item.product.title)
					.join(", ")}. Please review it in your dashboard.`,
				icon: "/web-app-manifest-192x192.png",
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/farmer/orders/${order.id}`
			}
		})
	}

	// If the order is cancelled or completed, notify the farmer as well
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
					statusDescription: `Order #${order.id} has been ${newStatus.toLowerCase()}. \nDetails:\n- Customer: ${order.customer.name}\n- Price: ₱${order.totalPrice}\n- Items: ${order.items
						.map((item) => `${item.product.title} (x${item.quantity})`)
						.join(", ")}`,
					actionPrompt: "Please review the order details in your dashboard.",
					dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/orders/${order.id}`
				})
			},
			sms: `Order ${newStatus.toLowerCase()}. Customer: ${order.customer.name}, Price: ₱${order.totalPrice}. Please review it in your dashboard.`,
			push: {
				title: `Order Completed`,
				body: `Order #${order.id} has been ${newStatus.toLowerCase()}. Customer: ${order.customer.name}, Price: ₱${order.totalPrice}. Please review it in your dashboard.`,
				icon: "/web-app-manifest-192x192.png",
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/orders/${order.id}`
			}
		})
	}
}

export async function notifyNewMessage(data: {
	content: string
	fileUrl?: string | null
	senderId: string
	receiverId: string
	receiverRole: ROLE
	senderRole: ROLE
	fileType?: "image" | "video"
	replyToId?: string | null
	replyTo?: Message | null
}) {
	// // Find the recipient (the participant who is not the sender)
	// Fetch sender's and recipient's names
	const senderName = await getUserName(data.senderId)
	const recipientName = await getUserName(data.receiverId)
	const dashboardUrl =
		data.senderRole === "FARMER"
			? `${process.env.NEXT_PUBLIC_BASE_URL}/messages/${data.senderId}`
			: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/farmer/messages/${data.senderId}`
	// Prepare attachment info if present
	let attachmentInfo = ""
	if (data.fileUrl) {
		attachmentInfo = `[Attachment: ${data.fileType}]`
	}
	// Prepare message preview
	const messagePreview = `${data.content.substring(0, 97)}${data.content.length > 97 ? "..." : ""}`
	await sendNotification(data.receiverId, NotificationType.NEW_MESSAGE, {
		email: {
			subject: `New message from ${senderName} on FarmPreneur`,
			component: NewMessageEmail({
				recipientName,
				senderName,
				messagePreview: `${messagePreview} ${attachmentInfo}`,
				dashboardUrl
			})
		},
		sms: `New message from ${senderName} on FarmPreneur: "${messagePreview}" ${attachmentInfo}. Check your dashboard to view and reply.`,
		push: {
			title: "New Message",
			body: `${senderName}: ${messagePreview} ${attachmentInfo}`,
			icon: "/web-app-manifest-192x192.png",
			url: dashboardUrl
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
	const { role } = await verifySession()
	const order = await db.order.findUnique({
		where: { id: orderId },
		include: {
			customer: { include: { user: true } },
			farmer: { include: { user: true } }
		}
	})

	if (!order || !order.customer || !order.farmer)
		throw new Error("Order, Customer, or Farmer not found")

	const url =
		role === ROLE.CUSTOMER
			? `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order.id}`
			: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/farmer/orders/${order.id}`

	await Promise.all([
		sendNotification(order.customer.userId, NotificationType.ORDER_STATUS, {
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
				url
			}
		}),
		sendNotification(order.farmer.userId, NotificationType.ORDER_STATUS, {
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
				url
			}
		})
	])
}

export async function notifyProductExpired(productId: string) {
	const product = await db.product.findUnique({
		where: { id: productId },
		include: { farmer: { include: { user: true } } }
	})

	if (!product || !product.farmer)
		throw new Error("Product or Farmer not found")

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
		// sms: `Your product "${product.title}" has expired and is no longer visible on the FarmPreneur marketplace. Please update or relist if necessary.`,
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

export async function notifyAdminNewFarmerRegistration(farmerId: string) {
	const farmer = await db.farmer.findUnique({
		where: { id: farmerId },
		include: { user: true }
	})
	if (!farmer) throw new Error("Farmer not found")

	const admins = await db.user.findMany({
		where: { role: ROLE.ADMIN }
	})

	for (const admin of admins) {
		await sendNotification(admin.id, NotificationType.FARMER_APPROVAL, {
			email: {
				subject: "New Farmer Registration Awaiting Approval",
				component: AdminNotificationEmail({
					adminName: admin.name || "Admin",
					notificationType: "New Farmer Registration",
					content: `${farmer.name} (${farmer.user.email}) has registered as a new farmer and is awaiting approval.`,
					actionUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/users/farmers/${farmer.id}`
				})
			},
			sms: `${farmer.name} has registered as a new farmer and is awaiting approval.`,
			push: {
				title: "New Farmer Registration",
				body: `${farmer.name} has registered as a new farmer and is awaiting approval.`,
				icon: "/web-app-manifest-192x192.png",
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/users/farmers/${farmer.id}`
			}
		})
	}
}

export async function notifyAdminProductListed(
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

	// await db.product.update({
	// 	where: { id: productId },
	// 	data: { listingStatus: status }
	// })

	if (status === ProductListingStatus.PENDING) {
		const admins = await db.user.findMany({
			where: { role: ROLE.ADMIN }
		})

		const dashboardUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/products/${product.id}`
		for (const admin of admins) {
			await sendNotification(admin.id, NotificationType.NEW_PRODUCT, {
				email: {
					subject: "New Product Listing Awaiting Approval",
					component: AdminNotificationEmail({
						adminName: admin.name || "Admin",
						notificationType: "New Product Listing",
						content: `A new product "${product.title}" by ${product.farmer.name} is awaiting approval.`,
						actionUrl: dashboardUrl
					})
				},
				sms: `A new product "${product.title}" by ${product.farmer.name} is awaiting approval.`,
				push: {
					title: "New Product Listing",
					body: `A new product "${product.title}" by ${product.farmer.name} is awaiting approval.`,
					icon: "/web-app-manifest-192x192.png",
					url: dashboardUrl
				}
			})
		}
	}

	// Existing code for other statuses...
}

export async function notifyAdminSystemAlert(
	alertType: string,
	message: string,
	actionUrl?: string
) {
	// const admins = await db.user.findMany({
	// 	where: { role: UserRole.ADMIN }
	// })
	// for (const admin of admins) {
	// 	await sendNotification(admin.id, NotificationType.ADMIN_ALERT, {
	// 		email: {
	// 			subject: `System Alert: ${alertType}`,
	// 			component: AdminNotificationEmail({
	// 				adminName: admin.name || "Admin",
	// 				notificationType: alertType,
	// 				content: message,
	// 				actionUrl:
	// 					actionUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/admin/dashboard`
	// 			})
	// 		},
	// 		push: {
	// 			title: `System Alert: ${alertType}`,
	// 			body: message,
	// 			icon: "/web-app-manifest-192x192.png",
	// 			url: actionUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/admin/dashboard`
	// 		}
	// 	})
	// }
}

export async function notifyAdminUserReport(
	reportType: string,
	reporterId: string,
	reportedItemId: string,
	reason: string
) {
	// const reporter = await db.user.findUnique({
	// 	where: { id: reporterId }
	// })
	// if (!reporter) throw new Error("Reporter not found")
	// const admins = await db.user.findMany({
	// 	where: { role: UserRole.ADMIN }
	// })
	// for (const admin of admins) {
	// 	await sendNotification(admin.id, NotificationType.ADMIN_ALERT, {
	// 		email: {
	// 			subject: `User Report: ${reportType}`,
	// 			component: AdminNotificationEmail({
	// 				adminName: admin.name || "Admin",
	// 				notificationType: "User Report",
	// 				content: `${reporter.name} (${reporter.email}) has reported a ${reportType}. Reason: ${reason}`,
	// 				actionUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/reports/${reportedItemId}`
	// 			})
	// 		},
	// 		push: {
	// 			title: `User Report: ${reportType}`,
	// 			body: `A ${reportType} has been reported. Reason: ${reason}`,
	// 			icon: "/web-app-manifest-192x192.png",
	// 			url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/reports/${reportedItemId}`
	// 		}
	// 	})
	// }
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
	try {
		await db.pushSubscription.create({
			data: {
				userId: userId,
				endpoint: sub.endpoint,
				p256dh: sub.keys.p256dh,
				auth: sub.keys.auth
			}
		})
		return { success: true, error: null }
	} catch (error) {
		return { success: false, error: getErrorMessage(error) }
	}
}

export async function unsubscribeUser(endpoint: string) {
	await db.pushSubscription.delete({
		where: {
			endpoint: endpoint
		}
	})
	return { success: true, message: "Push subscription removed successfully" }
}

export const readNotifications = async (prevState: any) => {
	const { userId } = await verifySession()
	try {
		await db.notification.updateMany({
			where: {
				userId: userId
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

export const readNotification = async (
	prevState: any,
	notificationId: string
) => {
	await verifySession()
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
