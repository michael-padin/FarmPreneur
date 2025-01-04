"use client"

import { Notification } from "@prisma/client"
import {
	createContext,
	ReactNode,
	use,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useOptimistic
} from "react"

// Context type
interface NotificationContextType {
	addNotification: (newNotification: Notification) => void
	notifications: Notification[]
	unreadCount: number
	readAllNotifications: () => void
	readNotification: (notificationId: string) => void
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
			return [action.payload, ...state]
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
	const [optimisticNotifications, addOptimisticNotifications] = useOptimistic(
		initialNotifications,
		notificationReducer
	)

	useEffect(() => {
		console.log("optimisticNotifications :>> ", optimisticNotifications)
	}, [optimisticNotifications])

	const unreadCount = optimisticNotifications.filter(
		(notification) => !notification.isRead
	).length

	const readAllNotifications = useCallback(() => {
		addOptimisticNotifications({ type: "MARK_ALL_READ" })
	}, [addOptimisticNotifications])

	// Mark notification as read
	const readNotification = useCallback(
		(notificationId: string) => {
			addOptimisticNotifications({
				type: "MARK_SINGLE_READ",
				payload: notificationId
			})
		},
		[addOptimisticNotifications]
	)

	const addNotification = useCallback(
		(newNotification: Notification) => {
			addOptimisticNotifications({
				type: "ADD_NOTIFICATION",
				payload: newNotification
			})
		},
		[addOptimisticNotifications]
	)

	const contextValue = useMemo(
		() => ({
			addNotification,
			notifications: optimisticNotifications,
			unreadCount,
			readNotification,
			readAllNotifications
		}),
		[
			addNotification,
			optimisticNotifications,
			unreadCount,
			readNotification,
			readAllNotifications
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
