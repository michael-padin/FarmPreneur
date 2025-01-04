"use client"
import { useMediaQuery } from "@/hooks/use-media-query"
import { pusherClient } from "@/lib/pusher"
import { Notification } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

type Metadata = {
	url?: string
}

export function PusherNotificationListener({ userId }: { userId: string }) {
	const router = useRouter()
	const isDesktop = useMediaQuery("(min-width: 768px)")

	useEffect(() => {
		if (userId) {
			const channel = pusherClient.subscribe(`user-${userId}`)

			const notificationSound = new Audio("/notification.mp3")
			// this function will run every notification received
			const handleNewNotification = async (newNotification: Notification) => {
				const metadata = newNotification.metadata as Metadata
				toast.info(`${newNotification.title}`, {
					description: newNotification.message,
					dismissible: true,
					position: isDesktop ? "bottom-right" : "top-center",
					duration: 5000,
					closeButton: true,
					...(metadata.url && {
						action: {
							label: "View",
							onClick: () => router.push(metadata.url || "/")
						}
					})
				})
				notificationSound.play()
				router.refresh()
			}

			channel.bind("notification", handleNewNotification)

			// Cleanup subscription
			return () => {
				pusherClient.unsubscribe(`user-${userId}`)
			}
		}
	}, [userId, isDesktop, router])

	return null
}
