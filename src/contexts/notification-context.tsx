"use client"

import { markNotificationAsRead, markNotificationsAsRead } from "@/lib/actions"
import { showErrorToast } from "@/lib/handle-error"
import { Notification } from "@prisma/client"
import {
	createContext,
	ReactNode,
	use,
	useCallback,
	useContext,
	useMemo,
	useOptimistic,
	useTransition
} from "react"

// Context type
interface NotificationContextType {
	handleAddOptimisticNotification: (newNotification: Notification) => void
	notifications: Notification[]
	unreadCount: number
	markAllAsRead: () => void
	markAsRead: (notificationId: string) => Promise<void>
}

// Reducer action types
type NotificationAction =
	| { type: "SET_INITIAL_NOTIFICATIONS"; payload: Notification[] }
	| { type: "ADD_NOTIFICATION"; payload: Notification }
	| { type: "MARK_ALL_READ" }
	| { type: "MARK_SINGLE_READ"; payload: string }
	| { type: "RESET_NOTIFICATIONS"; payload: Notification[] }

// Reducer function
function notificationReducer(
	state: Notification[],
	action: NotificationAction
): Notification[] {
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
	initialNotificationsPromise: Promise<Notification[]>
}) {
	const initialNotifications = use(initialNotificationsPromise)
	const [isPending, startTransition] = useTransition()

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
		(newNotification: Notification) => {
			startTransition(() => {
				addOptimisticNotifications({
					type: "ADD_NOTIFICATION",
					payload: newNotification
				})
			})
		},
		[addOptimisticNotifications]
	)

	const contextValue = useMemo(
		() => ({
			handleAddOptimisticNotification,

			notifications: optimisticNotifications,
			unreadCount,
			markAsRead,
			markAllAsRead
		}),
		[
			optimisticNotifications,
			unreadCount,
			markAsRead,
			markAllAsRead,
			handleAddOptimisticNotification
		]
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
