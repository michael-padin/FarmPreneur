"use client"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/contexts/notification-context"

export function ReadAllButton() {
	const { markAllAsRead, unreadCount } = useNotifications()
	return (
		<Button size={"sm"} disabled={unreadCount === 0} onClick={markAllAsRead}>
			Read All
		</Button>
	)
}
