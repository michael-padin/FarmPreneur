import { auth } from "@/auth"
import { PushNotificationManager } from "./push-notification-manager"

export async function PushNotificationManagerWrapper() {
	const session = await auth()

	if (!session || !session.user) return null

	return <PushNotificationManager session={session} />
}
