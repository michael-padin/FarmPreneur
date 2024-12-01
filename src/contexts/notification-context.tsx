"use client"

import {
	getNotificationsByUserIdUseCase,
	markAllNotificationsAsReadUseCase,
	markNotificationAsReadUseCase
} from "@/use-cases/notifications"
import { pusherClient } from "@/lib/pusher"
import { Notification as NotificationType } from "@/types/notification"
import React, {
	createContext,
	useState,
	useContext,
	useEffect,
	ReactNode,
	useCallback
} from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Context type
interface NotificationContextType {
	notifications: NotificationType[]
	unreadCount: number
	markAllAsRead: () => void
	markAsRead: (notificationId: string) => Promise<void>
	fetchInitialNotifications: (userId: string) => Promise<void>
	setNotifications: React.Dispatch<React.SetStateAction<NotificationType[]>>
}

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined
)

export function NotificationProvider({
	children,
	userId
}: {
	children: ReactNode
	userId: string
}) {
	const router = useRouter()
	const [notifications, setNotifications] = useState<NotificationType[]>([])
	const [unreadCount, setUnreadCount] = useState(0)

	// Fetch initial notifications
	const fetchInitialNotifications = useCallback(async (userId: string) => {
		try {
			const initialNotifications = (await getNotificationsByUserIdUseCase(
				userId
			)) as NotificationType[]
			setNotifications(initialNotifications)
			setUnreadCount(
				initialNotifications.filter((notification) => !notification.isRead)
					.length
			)
		} catch (error) {
			console.error("Failed to fetch initial notifications", error)
		}
	}, [])

	const markAllAsRead = useCallback(async () => {
		const result = await markAllNotificationsAsReadUseCase(userId)

		if (result) {
			setNotifications((prevNotifications) =>
				prevNotifications.map((notification) => ({
					...notification,
					isRead: true
				}))
			)

			setUnreadCount(0)
		}
	}, [userId])

	// Mark notification as read
	const markAsRead = useCallback(async (notificationId: string) => {
		try {
			const result = await markNotificationAsReadUseCase(notificationId)

			if (result) {
				setNotifications((prev) =>
					prev.map((notification) =>
						notification.id === notificationId
							? { ...notification, isRead: true }
							: notification
					)
				)
				// Update unread count
				setUnreadCount((prev) => (prev < 1 ? 0 : prev - 1))
			}
		} catch (error) {
			console.error("Failed to mark notification as read", error)
		}
	}, [])

	useEffect(() => {
		if (!userId) return

		// Fetch initial notifications
		fetchInitialNotifications(userId)
	}, [fetchInitialNotifications, userId])

	// Setup Pusher subscription
	useEffect(() => {
		// Subscribe to Pusher channel
		const channel = pusherClient.subscribe(`user-${userId}-notifications`)

		const notificationSound = new Audio("/notification.mp3")

		// this function will run every notification received
		const handleNewNotification = (newNotification: NotificationType) => {
			setNotifications((prev) => [newNotification, ...prev])

			toast(`${newNotification.title}`, {
				description: newNotification.message,
				action: {
					label: "View",
					onClick: () => router.push("/dashboard/notifications")
				},
				duration: 5000
			})

			notificationSound.play()
			if ("Notification" in window && Notification.permission === "granted") {
				new Notification(newNotification.title, {
					body: newNotification.message
				})
			}

			// Increment unread count if the new notification is unread
			if (!newNotification.isRead) {
				setUnreadCount((prev) => prev + 1)
			}
		}

		channel.bind("new-notification", handleNewNotification)

		// Cleanup subscription
		return () => {
			pusherClient.unsubscribe(`user-${userId}-notifications`)
			channel.unbind("new-notification", handleNewNotification)
		}
	}, [userId, router])

	return (
		<NotificationContext.Provider
			value={{
				notifications,
				unreadCount,
				setNotifications,
				markAsRead,
				markAllAsRead,
				fetchInitialNotifications
			}}
		>
			{children}
		</NotificationContext.Provider>
	)
}

// Custom hook to use the Notification Context
export function useNotifications() {
	const context = useContext(NotificationContext)
	if (context === undefined) {
		throw new Error(
			"useNotifications must be used within a NotificationProvider"
		)
	}
	return context
}
