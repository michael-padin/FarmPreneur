"use client"

import { subscribeUser } from "@/app/actions/notifications"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState, useTransition } from "react"
import { toast } from "sonner"

function urlBase64ToUint8Array(base64String: string): Uint8Array {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
	const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")

	const rawData = window.atob(base64)
	const outputArray = new Uint8Array(rawData.length)

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i)
	}
	return outputArray
}

export function PushNotificationManager() {
	const session = useSession()
	const [permission, setPermission] =
		useState<NotificationPermission>("default")
	const [isPending, startTransition] = useTransition()

	const [isSubscribed, setIsSubscribed] = useState(false)
	const [subscription, setSubscription] = useState<PushSubscription | null>(
		null
	)

	const subscribeToPush = useCallback(
		(registration: ServiceWorkerRegistration | null) => {
			const applicationServerKey = urlBase64ToUint8Array(
				process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
			)
			startTransition(async () => {
				const sub = await registration?.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: applicationServerKey
				})

				if (sub) {
					const serializedSub = JSON.parse(JSON.stringify(sub))
					setIsSubscribed(true)
					await subscribeUser(serializedSub)
				}
			})
		},
		[]
	)

	// Register the service worker
	const registerServiceWorker = useCallback(async () => {
		if ("serviceWorker" in navigator && "PushManager" in window) {
			try {
				const registration = await navigator.serviceWorker.register("/sw.js", {
					scope: "/",
					updateViaCache: "none"
				})
				subscribeToPush(registration)
				console.log("Service Worker registered with scope:", registration.scope)
			} catch (error) {
				console.error("Service Worker registration failed:", error)
			}
		}
	}, [subscribeToPush])

	const requestNotificationPermission = useCallback(async () => {
		if (!("Notification" in window)) {
			toast("Notifications not supported", {
				description: "Your browser doesn't support push notifications."
			})
			return
		}

		try {
			const result = await Notification.requestPermission()
			setPermission(result)
			if (result === "granted") {
				await registerServiceWorker()
				toast("Notifications enabled", {
					description: "You will now receive push notifications."
				})
			} else if (result === "denied") {
				toast("Notifications disabled", {
					description: "You have chosen not to receive push notifications."
				})
			}
		} catch (error) {
			console.error("Error requesting notification permission:", error)
			toast("Error", {
				description: "There was an error requesting notification permission."
			})
		}
	}, [registerServiceWorker])

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (
				document.visibilityState === "visible" &&
				permission === "default" &&
				session.status === "authenticated"
			) {
				requestNotificationPermission()
			}
		}

		document.addEventListener("visibilitychange", handleVisibilityChange)

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange)
		}
	}, [permission, requestNotificationPermission, session.status])

	useEffect(() => {
		if ("Notification" in window && session.status === "authenticated") {
			setPermission(Notification.permission)
			if (Notification.permission === "default") {
				requestNotificationPermission()
			}
		}
	}, [requestNotificationPermission, session.status])

	return null
}
