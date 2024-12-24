"use client"

import { Button } from "@/components/ui/button"
import { sendNotification, subscribeUser, unsubscribeUser } from "@/lib/actions"
import { Plus, Share } from "lucide-react"
import { useEffect, useState } from "react"
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle
} from "./ui/drawer"

function urlBase64ToUint8Array(base64String: string) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

	const rawData = window.atob(base64)
	const outputArray = new Uint8Array(rawData.length)

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i)
	}
	return outputArray
}

const PROMPT_INTERVAL = 3 * 24 * 60 * 60 * 1000 // 3 days in milliseconds

export function InstallPrompt() {
	const [isIOS, setIsIOS] = useState(false)
	const [isStandalone, setIsStandalone] = useState(false)
	const [isOpen, setIsOpen] = useState(false)

	const handleDismiss = () => {
		setIsOpen(false)
		localStorage.setItem("lastInstallPrompt", Date.now().toString())
	}

	useEffect(() => {
		setIsIOS(
			/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
		)
		setIsStandalone(window.matchMedia("(display-mode: standalone)").matches)
	}, [])

	useEffect(() => {
		const checkPromptVisibility = () => {
			const lastPrompt = localStorage.getItem("lastInstallPrompt")
			const now = Date.now()

			if (
				!lastPrompt ||
				(now - parseInt(lastPrompt) > PROMPT_INTERVAL && isIOS)
			) {
				setIsOpen(true)
				localStorage.setItem("lastInstallPrompt", now.toString())
			}
		}

		const timer = setTimeout(checkPromptVisibility, 1000)
		return () => clearTimeout(timer)
	}, [isIOS])

	if (isStandalone || !isIOS) {
		return null
	}
	return (
		<Drawer open={isOpen} onOpenChange={setIsOpen}>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle className="">
						To install this app on your iOS device:
					</DrawerTitle>
					<DrawerDescription className="sr-only">
						Install description
					</DrawerDescription>
				</DrawerHeader>
				{isIOS && (
					<div className="space-y-2 px-4 pb-4">
						<p className="text-sm text-muted-foreground">
							To install this app on your iOS device:
						</p>
						<ol className="list-inside list-decimal space-y-1 text-sm">
							<li>
								Tap the share button <Share className="inline h-4 w-4" />
							</li>
							<li>
								Scroll down and tap &quot;Add to Home Screen&quot;{" "}
								<Plus className="inline h-4 w-4" />
							</li>
						</ol>
					</div>
				)}
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button onClick={handleDismiss}>Got it!</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}

export function PushNotificationManager() {
	const [isSupported, setIsSupported] = useState(false)
	const [subscription, setSubscription] = useState<PushSubscription | null>(
		null
	)
	const [message, setMessage] = useState("")

	useEffect(() => {
		if ("serviceWorker" in navigator && "PushManager" in window) {
			setIsSupported(true)
			registerServiceWorker()
		}
	}, [])

	async function registerServiceWorker() {
		const registration = await navigator.serviceWorker.register("/sw.js", {
			scope: "/",
			updateViaCache: "none"
		})
		const sub = await registration.pushManager.getSubscription()
		setSubscription(sub)
	}

	async function subscribeToPush() {
		const registration = await navigator.serviceWorker.ready
		const sub = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(
				process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
			)
		})
		setSubscription(sub)
		const serializedSub = JSON.parse(JSON.stringify(sub))
		await subscribeUser(serializedSub)
	}

	async function unsubscribeFromPush() {
		await subscription?.unsubscribe()
		setSubscription(null)
		await unsubscribeUser()
	}

	async function sendTestNotification() {
		if (subscription) {
			await sendNotification(message)
			setMessage("")
		}
	}

	if (!isSupported) {
		return <p>Push notifications are not supported in this browser.</p>
	}

	return (
		<div>
			<h3>Push Notifications</h3>
			{subscription ? (
				<>
					<p>You are subscribed to push notifications.</p>
					<button onClick={unsubscribeFromPush}>Unsubscribe</button>
					<input
						type="text"
						placeholder="Enter notification message"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
					<button onClick={sendTestNotification}>Send Test</button>
				</>
			) : (
				<>
					<p>You are not subscribed to push notifications.</p>
					<button onClick={subscribeToPush}>Subscribe</button>
				</>
			)}
		</div>
	)
}
