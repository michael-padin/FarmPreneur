"use server"
import {
	createNotificationByUserId,
	getNotificationsByUserId,
	markAllNotificationsAsRead,
	markNotificationAsRead
} from "@/data-access/notifications"
import { getAdminIds } from "@/data-access/users"
import { pusherServer } from "@/lib/pusher"
import { NotifMetadata } from "@/types/notification"
import { NotificationType } from "@prisma/client"

export const getNotificationsByUserIdUseCase = async (userId: string) => {
	if (!userId) {
		return []
	}
	return await getNotificationsByUserId(userId)
}

export const createNotificationByUserIdUseCase = async (data: {
	userId: string
	message: string
	type: NotificationType
	title: string
	metadata?: NotifMetadata
}) => {
	console.log("data :>> ", data)
	try {
		const notification = await createNotificationByUserId(data)
		await pusherServer.trigger(
			`user-${data.userId}-notifications`,
			"new-notification",
			notification
		)
	} catch (e) {
		throw e
	}
}

export const markNotificationAsReadUseCase = async (notificationId: string) => {
	try {
		return await markNotificationAsRead(notificationId)
	} catch (e) {
		throw e
	}
}

export const createNotificationsForAdminsUseCase = async (data: {
	title: string
	message: string
	type: NotificationType
	metadata?: NotifMetadata
}) => {
	try {
		const adminIds = await getAdminIds()

		const notifications = await Promise.all(
			adminIds.map(async (admin) => {
				return await createNotificationByUserId({
					userId: admin.id,
					message: data.message,
					type: data.type,
					title: data.title,
					metadata: data.metadata
				})
			})
		)

		await Promise.all(
			notifications.map(async (notification) => {
				await pusherServer.trigger(
					`user-${notification.userId}-notifications`,
					"new-notification",
					notification
				)
			})
		)
	} catch (e) {
		throw e
	}
}

export const markAllNotificationsAsReadUseCase = async (userId: string) => {
	try {
		return await markAllNotificationsAsRead(userId)
	} catch (e) {
		throw e
	}
}
