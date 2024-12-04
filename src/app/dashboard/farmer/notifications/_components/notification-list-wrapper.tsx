import { auth } from "@/auth"
import { getNotificationsByUserIdUseCase } from "@/use-cases/notifications"
import { NotificationList } from "./notification-list"

export async function NotificationListWrapper() {
	const session = await auth()
	const user = session?.user

	if (!user) {
		return <div>You are not logged in</div>
	}

	const notificationsPromise = getNotificationsByUserIdUseCase(user.id)

	return <NotificationList notificationsPromise={notificationsPromise} />
}
