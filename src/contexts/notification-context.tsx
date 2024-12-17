"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import {
	markNotificationAsRead,
	markNotificationsAsRead,
	revalidatePathFromNotifications
} from "@/lib/actions"
import { showErrorToast } from "@/lib/handle-error"
import { pusherClient } from "@/lib/pusher"
import { Notification as NotificationType } from "@/types/notification"
import { NotificationType as PrismaNotificationType } from "@prisma/client"
import { useRouter } from "next/navigation"
import {
	createContext,
	ReactNode,
	use,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useOptimistic,
	useTransition
} from "react"
import { toast } from "sonner"

// Context type
interface NotificationContextType {
	notifications: NotificationType[]
	unreadCount: number
	markAllAsRead: () => void
	markAsRead: (notificationId: string) => Promise<void>
}

// Reducer action types
type NotificationAction =
	| { type: "SET_INITIAL_NOTIFICATIONS"; payload: NotificationType[] }
	| { type: "ADD_NOTIFICATION"; payload: NotificationType }
	| { type: "MARK_ALL_READ" }
	| { type: "MARK_SINGLE_READ"; payload: string }
	| { type: "RESET_NOTIFICATIONS"; payload: NotificationType[] }

// Reducer function
function notificationReducer(
	state: NotificationType[],
	action: NotificationAction
): NotificationType[] {
	switch (action.type) {
		case "SET_INITIAL_NOTIFICATIONS":
			return action.payload
		case "ADD_NOTIFICATION":
			return [...state, action.payload]
		case "MARK_ALL_READ":
			return state.map((notification) => ({ ...notification, isRead: true }))
		case "MARK_SINGLE_READ":
			return state.map((notification) =>
				notification.id === action.payload
					? { ...notification, isRead: true }
					: notification
			)
		case "RESET_NOTIFICATIONS":
			return action.payload
		default:
			return state
	}
}

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined
)

export function NotificationProvider({
	children,
	userId,
	initialNotificationsPromise
}: {
	children: ReactNode
	userId?: string
	initialNotificationsPromise: Promise<NotificationType[]>
}) {
	const initialNotifications = use(initialNotificationsPromise)
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const isDesktop = useMediaQuery("(min-width: 768px)")

	const [optimisticNotifications, addOptimisticNotifications] = useOptimistic(
		initialNotifications,
		notificationReducer
	)

	const unreadCount = useMemo(
		() =>
			optimisticNotifications.filter((notification) => !notification.isRead)
				.length,
		[optimisticNotifications]
	)

	const markAllAsRead = useCallback(async () => {
		startTransition(async () => {
			addOptimisticNotifications({ type: "MARK_ALL_READ" })
			const { error } = await markNotificationsAsRead(userId || "")
			if (error) {
				showErrorToast(error)
			}
		})
	}, [userId, addOptimisticNotifications])

	// Mark notification as read
	const markAsRead = useCallback(
		async (notificationId: string) => {
			startTransition(async () => {
				addOptimisticNotifications({
					type: "MARK_SINGLE_READ",
					payload: notificationId
				})
				const { error } = await markNotificationAsRead(notificationId)

				if (error) {
					showErrorToast(error)
				}
			})
		},
		[addOptimisticNotifications]
	)

	const handleAddOptimisticNotification = useCallback(
		(newNotification: NotificationType) => {
			startTransition(() => {
				addOptimisticNotifications({
					type: "ADD_NOTIFICATION",
					payload: newNotification
				})
			})
		},
		[addOptimisticNotifications]
	)

	const handleRevalidatePaths = useCallback(
		(notificationType: PrismaNotificationType) => {
			startTransition(async () => {
				await revalidatePathFromNotifications(notificationType)
			})
		},
		[]
	)

	useEffect(() => {
		// Subscribe to Pusher channel
		const channel = pusherClient.subscribe(`user-${userId}-notifications`)

		const notificationSound = new Audio("/notification.mp3")

		// this function will run every notification received
		const handleNewNotification = async (newNotification: NotificationType) => {
			handleRevalidatePaths(newNotification.type)
			handleAddOptimisticNotification(newNotification)
			toast.info(`${newNotification.title}`, {
				description: newNotification.message,
				dismissible: true,
				position: isDesktop ? "top-right" : "top-right",
				duration: 5000,
				closeButton: true
			})

			notificationSound.play()
		}

		channel.bind("new-notification", handleNewNotification)

		// Cleanup subscription
		return () => {
			pusherClient.unsubscribe(`user-${userId}-notifications`)
			channel.unbind("new-notification", handleNewNotification)
		}
	}, [
		handleRevalidatePaths,
		userId,
		router,
		isDesktop,
		addOptimisticNotifications,
		handleAddOptimisticNotification
	])

	const contextValue = useMemo(
		() => ({
			notifications: optimisticNotifications,
			unreadCount,
			markAsRead,
			markAllAsRead
		}),
		[optimisticNotifications, unreadCount, markAsRead, markAllAsRead]
	)

	return (
		<NotificationContext.Provider value={contextValue}>
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
