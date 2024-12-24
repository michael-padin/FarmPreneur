import { verifySession } from "@/lib/dal"
import { db } from "@/lib/db"
import { NotifMetadata } from "@/types/notification"
import { NotificationType } from "@prisma/client"

export const getNotificationsByUserId = async (userId: string) => {
	return await db.notification.findMany({
		where: {
			userId: userId
		},
		orderBy: {
			createdAt: "desc"
		}
	})
}

export const getTotalUnreadNotifications = async () => {
	const { userId } = await verifySession()

	return await db.notification.count({
		where: {
			userId: userId,
			isRead: false
		}
	})
}

// MARK: MUTATIONS
export const createNotificationByUserId = async (data: {
	userId: string
	message: string
	type: NotificationType
	title: string
	metadata?: NotifMetadata
}) => {
	return await db.notification.create({
		data: {
			isRead: false,
			type: data.type,
			userId: data.userId,
			message: data.message,
			title: data.title,
			metadata: data.metadata
		}
	})
}

export const markAllNotificationsAsRead = async (userId: string) => {
	return await db.notification.updateMany({
		where: {
			userId: userId
		},
		data: {
			isRead: true
		}
	})
}
