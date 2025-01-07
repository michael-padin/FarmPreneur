"use client"

import { subscribeUser } from "@/app/actions/notifications"
import { Session } from "next-auth"
import { useCallback, useEffect, useState, useTransition } from "react"
import { toast } from "sonner"

function urlBase64ToUint8Array(base64String: string): Uint8Array {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
	const rawData = window.atob(base64)
	const outputArray = new Uint8Array(rawData.length)

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i)
	}
	return outputArray
}

export function PushNotificationManager({ session }: { session: Session }) {
	const [permission, setPermission] =
		useState<NotificationPermission>("default")
	const [isPending, startTransition] = useTransition()
	const [isSubscribed, setIsSubscribed] = useState(false)
	const [swRegistration, setSwRegistration] =
		useState<ServiceWorkerRegistration | null>(null)

	const subscribeToPush = useCallback(() => {
		if (!swRegistration) return

		startTransition(async () => {
			try {
				const applicationServerKey = urlBase64ToUint8Array(
					process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ""
				)

				const sub = await swRegistration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey
				})

				if (sub) {
					const serializedSub = JSON.parse(JSON.stringify(sub))
					setIsSubscribed(true)
					await subscribeUser(serializedSub)
				}
			} catch (error) {
				console.error("Failed to subscribe to push:", error)
			}
		})
	}, [swRegistration])

	const registerServiceWorker = useCallback(() => {
		if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
			toast.error("Push notifications are not supported in this browser")
			return
		}

		startTransition(async () => {
			try {
				const registration = await navigator.serviceWorker.register("/sw.js", {
					scope: "/",
					updateViaCache: "none"
				})

				setSwRegistration(registration)
				const subscription = await registration.pushManager.getSubscription()

				if (subscription) {
					setIsSubscribed(true)
				} else if (permission === "granted") {
					subscribeToPush()
				}
			} catch (error) {
				console.error("Service Worker registration failed:", error)
				// toast.error("Failed to register service worker")
			}
		})
	}, [permission, subscribeToPush])

	const requestNotificationPermission = useCallback(() => {
		if (!("Notification" in window)) {
			toast.error("Notifications are not supported in this browser")
			return
		}

		startTransition(async () => {
			try {
				const result = await Notification.requestPermission()
				setPermission(result)

				if (result === "granted") {
					await registerServiceWorker()
				}
			} catch (error) {
				console.error("Error requesting notification permission:", error)
				toast.error("Failed to request notification permission")
			}
		})
	}, [registerServiceWorker])

	useEffect(() => {
		if (!session) return

		if ("Notification" in window) {
			const currentPermission = Notification.permission
			setPermission(currentPermission)

			if (currentPermission === "granted") {
				registerServiceWorker()
			} else if (currentPermission === "default") {
				requestNotificationPermission()
			}
		}
	}, [session, registerServiceWorker, requestNotificationPermission])

	return <></>
}
