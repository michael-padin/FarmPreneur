"use client"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/contexts/notification-context"
import { toast } from "sonner"

export function ReadAllButton() {
	const { markAllAsRead, unreadCount } = useNotifications()
	return (
		<Button
			size={"sm"}
			disabled={unreadCount === 0}
			onClick={() => {
				markAllAsRead()
				toast.success("Read All", {
					action: {
						label: "View",
						onClick: () => null
					}
				})
			}}
		>
			Read All
		</Button>
	)
}
