import { auth } from "@/auth"
import { PushNotificationManagerWrapper } from "@/components/push-notification-manager-wrapper"
import { CartProvider } from "@/contexts/cart-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { getCartUseCase } from "@/use-cases/cart"
import { getNotificationsByUserIdUseCase } from "@/use-cases/notifications"
import { PusherNotificationListener } from "../_components/pusher-notification-listener"

export default async function Layout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await auth()
	const userId = session?.user?.id

	const cartPromise = getCartUseCase()
	const initialNotificationsPromise = getNotificationsByUserIdUseCase()

	return (
		<NotificationProvider
			initialNotificationsPromise={initialNotificationsPromise}
			userId={userId}
		>
			<CartProvider initialCartPromise={cartPromise}>
				<PusherNotificationListener userId={userId || ""} />
				<PushNotificationManagerWrapper />
				{/* <UnderConstruction /> */}
				{children}
			</CartProvider>
		</NotificationProvider>
	)
}
