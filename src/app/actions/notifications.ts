"use server"

import { verifySession } from "@/lib/dal"
import { db } from "@/lib/db"
import webpush, { PushSubscription } from "web-push"

// MARK: WEB PUSH
webpush.setVapidDetails(
	`mailto:${process.env.WEB_PUSH_EMAIL}`,
	process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
	process.env.VAPID_PRIVATE_KEY!
)

export async function subscribeUser(sub: PushSubscription) {
	const { userId } = await verifySession()
	await db.pushSubscription.upsert({
		where: { userId: userId },
		update: {
			endpoint: sub.endpoint,
			p256dh: sub.keys.p256dh,
			auth: sub.keys.auth
		},
		create: {
			userId: userId,
			endpoint: sub.endpoint,
			p256dh: sub.keys.p256dh,
			auth: sub.keys.auth
		}
	})
	return { success: true, message: "Push subscription saved successfully" }
}

export async function unsubscribeUser(endpoint: string) {
	await db.pushSubscription.delete({
		where: {
			endpoint: endpoint
		}
	})
	return { success: true, message: "Push subscription removed successfully" }
}
