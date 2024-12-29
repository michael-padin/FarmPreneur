import { subscribeUser } from "@/app/actions/notifications"
import { startTransition, useCallback, useEffect, useState } from "react"

export function usePushNotifications() {
	const [isSubscribed, setIsSubscribed] = useState(false)
	const [subscription, setSubscription] = useState<PushSubscription | null>(
		null
	)
	const [registration, setRegistration] =
		useState<ServiceWorkerRegistration | null>(null)
	const subscribeToPush = useCallback(() => {
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
	}, [registration?.pushManager])
	useEffect(() => {
		if (
			typeof window !== "undefined" &&
			"serviceWorker" in navigator &&
			"PushManager" in window
		) {
			// Register service worker
			navigator.serviceWorker
				.register("/sw.js")
				.then((reg) => {
					setRegistration(reg)
					return reg.pushManager.getSubscription()
				})
				.then((sub) => {
					if (sub) {
						setIsSubscribed(true)
						setSubscription(sub)
					} else {
						subscribeToPush()
					}
				})
				.catch((error) => {
					console.error("Service Worker registration failed:", error)
				})
		}
	}, [subscribeToPush])

	return { isSubscribed, subscription }
}

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
