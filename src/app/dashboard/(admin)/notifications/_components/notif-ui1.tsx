import React from "react"
import {
	Bell,
	ShoppingBag,
	MessageCircle,
	Package,
	Gift,
	AlertCircle,
	CheckCircle
} from "lucide-react"
import { format } from "date-fns"

const NotifUI1 = () => {
	// In a real app, this would come from your API
	const notifications = [
		{
			id: "1",
			type: "ORDER_STATUS",
			message: "Your order #1234 has been confirmed and is being processed",
			isRead: false,
			createdAt: new Date(),
			userId: "user123"
		}
		// ... more notifications
	]

	const getNotificationIcon = (type) => {
		const iconProps = {
			className: "flex-shrink-0",
			size: 20
		}

		switch (type) {
			case "ORDER_STATUS":
				return <ShoppingBag {...iconProps} />
			case "NEW_MESSAGE":
				return <MessageCircle {...iconProps} />
			case "NEW_PRODUCT":
				return <Package {...iconProps} />
			case "PROMOTION":
				return <Gift {...iconProps} />
			case "SYSTEM_ALERT":
				return <AlertCircle {...iconProps} />
			case "VERIFICATION":
				return <CheckCircle {...iconProps} />
			default:
				return <Bell {...iconProps} />
		}
	}

	const getNotificationColor = (type) => {
		switch (type) {
			case "ORDER_STATUS":
				return "bg-blue-50 text-blue-700"
			case "NEW_MESSAGE":
				return "bg-purple-50 text-purple-700"
			case "NEW_PRODUCT":
				return "bg-green-50 text-green-700"
			case "PROMOTION":
				return "bg-yellow-50 text-yellow-700"
			case "SYSTEM_ALERT":
				return "bg-red-50 text-red-700"
			case "VERIFICATION":
				return "bg-teal-50 text-teal-700"
			default:
				return "bg-gray-50 text-gray-700"
		}
	}

	return (
		<div className="mx-auto w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-lg">
			<div className="border-b border-gray-200 bg-gray-50 p-4">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
					<div className="flex items-center space-x-2">
						<button className="text-sm text-blue-600 hover:text-blue-800">
							Mark all as read
						</button>
						<button className="text-sm text-gray-600 hover:text-gray-800">
							Clear all
						</button>
					</div>
				</div>
			</div>

			<div className="max-h-[600px] divide-y divide-gray-200 overflow-y-auto">
				{notifications.map((notification) => (
					<div
						key={notification.id}
						className={`p-4 transition-colors hover:bg-gray-50 ${
							!notification.isRead ? "bg-blue-50/20" : ""
						}`}
					>
						<div className="flex items-start space-x-4">
							<div
								className={`rounded-full p-2 ${getNotificationColor(notification.type)}`}
							>
								{getNotificationIcon(notification.type)}
							</div>

							<div className="min-w-0 flex-1">
								<div className="flex items-start justify-between">
									<p
										className={`text-sm font-medium ${!notification.isRead ? "text-gray-900" : "text-gray-600"}`}
									>
										{notification.message}
									</p>
									<div className="ml-4 flex-shrink-0">
										<button className="text-gray-400 hover:text-gray-500">
											<span className="sr-only">Close</span>
											<svg
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
											</svg>
										</button>
									</div>
								</div>
								<div className="mt-1 flex items-center space-x-2">
									<p className="text-xs text-gray-500">
										{format(notification.createdAt, "MMM d, yyyy • h:mm a")}
									</p>
									{!notification.isRead && (
										<span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
											New
										</span>
									)}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="border-t border-gray-200 bg-gray-50 p-4">
				<div className="flex justify-center">
					<button className="text-sm text-blue-600 hover:text-blue-800">
						Load more notifications
					</button>
				</div>
			</div>
		</div>
	)
}

export default NotifUI1
