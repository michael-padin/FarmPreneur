"use client"

import { NotificationItem } from "@/app/_components/notification-item"
import { useNotifications } from "@/contexts/notification-context"
import { NotificationIcon } from "./notification-icon"
import { Button } from "@/components/ui/button"
import { NotificationType } from "@prisma/client"
import Link from "next/link"
import { Notification } from "@/types/notification"

export const NotificationList = () => {
	const { markAllAsRead, markAsRead, notifications } = useNotifications()

	const renderMessage = (notif: Notification) => {
		switch (notif.type) {
			case NotificationType.ORDER_STATUS:
				return null
			case NotificationType.FARMER_APPROVAL:
				return (
					<div className=" ">
						<div className="mb-2 space-y-1">
							<p>
								A new farmer{" "}
								<span className="capitalize text-primary">
									{notif.metadata.user?.name}
								</span>{" "}
								has registered and is awaiting your approval.
							</p>
							<div className="text-sm">
								{/* <div className="flex gap-1 text-sm">
									<p className="text-muted-foreground">Name</p>
									<span className="capitalize text-primary">
										{notif?.metadata.productName}
									</span>
								</div> */}
								<div className="mt-2 w-full">
									<Button
										variant={"outline"}
										size={"sm"}
										asChild
										className="w-full lg:w-1/6"
										onClick={() => markAsRead(notif.id)}
									>
										<Link
											href={`/dashboard/users/${notif.metadata?.user?.userId}/edit`}
										>
											Review
										</Link>
									</Button>
								</div>

								{/* <p>Farmer ID: {notif.metadata.farmerId}</p> */}
							</div>
						</div>
					</div>
				)
			case NotificationType.PRODUCT_APPROVAL:
				return (
					<div className=" ">
						<div className="mb-2 space-y-1">
							<p>
								A new product{" "}
								<span className="capitalize text-primary">
									{notif.metadata.product?.productName}
								</span>{" "}
								has been submitted and is awaiting your review .
							</p>
							<div className="flex gap-1 text-sm">
								<p className="text-muted-foreground">From:</p>
								<Link
									href={`/dashboard/users/${notif.metadata.farmer?.farmerId}/edit`}
									className="underline-offset-2 hover:underline"
								>
									<span className="text-primary">
										{notif.metadata.farmer?.farmerName}
									</span>
								</Link>
							</div>

							<div className="mt-2 w-full">
								<Button
									variant={"outline"}
									size={"sm"}
									asChild
									className="w-full lg:w-1/6"
									onClick={() => markAsRead(notif.id)}
								>
									<Link
										href={`/dashboard/products/${notif.metadata.product?.productId}/edit`}
									>
										Review
									</Link>
								</Button>
							</div>

							{/* <p>Farmer ID: {notif.metadata.farmerId}</p> */}
						</div>
					</div>
				)
			case NotificationType.NEW_MESSAGE:
				return (
					// <NewMessageNotificationItem
					// 	title={notif.title}
					// 	message={notif.message}
					// 	metadata={notif.metadata}
					// />
					null
				)
			default:
				return null
		}
	}

	return (
		<div className="lg:container lg:mx-auto lg:rounded-lg lg:border lg:bg-card lg:p-6">
			<div className="flex items-center justify-between pb-4">
				<h2 className="text-2xl font-semibold leading-none tracking-tight">
					Notifications
				</h2>
				<Button variant="default" size="sm" onClick={markAllAsRead}>
					Read all
				</Button>
			</div>
			<div className="">
				{notifications.map((notif) => (
					<NotificationItem
						key={notif.id}
						{...notif}
						markAsRead={markAsRead}
						nodeMessage={renderMessage(notif)}
						Icon={
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
								<NotificationIcon type={notif.type} className="h-5 w-5" />
							</div>
						}
					/>
				))}
			</div>
		</div>
	)
}
