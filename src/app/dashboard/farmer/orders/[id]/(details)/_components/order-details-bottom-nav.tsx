"use client"
import { Button } from "@/components/ui/button"
import { getOrder } from "@/data-access/orders"
import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { AcceptOrder } from "../../../_components/accept-order"
import { CancelOrder } from "../../../_components/cancel-order"
import { SubStatusSelect } from "../../../_components/sub-status-select"
import { ViewCancellation } from "../../../_components/view-cancellation"

interface OrderDetailsBottomNavProps {
	order: Awaited<ReturnType<typeof getOrder>>
}

export default function OrderDetailsBottomNav({
	order
}: OrderDetailsBottomNavProps) {
	const canBeCancelled =
		order.status !== "CANCELLED" &&
		order.status !== "COMPLETED" &&
		order.subStatus !== "PICKED_UP_BY_BUYER"

	return (
		<div className="fixed bottom-0 left-0 right-0 z-10 bg-background drop-shadow-2xl">
			<div className="flex w-full items-center px-3 py-4">
				<div className="flex w-full gap-3">
					<div className="w-full">
						{order.status === "COMPLETED" ? (
							<Button variant="outline" asChild className="w-full">
								<Link
									href={`/dashboard/farmer/messages/${order.customer?.userId}`}
									className="w-full"
								>
									<MessageCircle />
									Send Message
								</Link>
							</Button>
						) : (
							<Button variant="outline" asChild size={"icon"}>
								<Link
									href={`/dashboard/farmer/messages/${order.customer?.userId}`}
									className="flex"
								>
									{order.subStatus === "BUYER_CONFIRMED_ORDER" ? (
										<span>Message</span>
									) : (
										<MessageCircle />
									)}
								</Link>
							</Button>
						)}
					</div>
					{canBeCancelled && (
						<CancelOrder orderId={order.id} status={order.status} />
					)}

					{order.status === "IN_PROGRESS" && (
						<div className="flex-1">
							<SubStatusSelect
								triggerClassName="bg-primary text-primary-foreground hover:bg-primary/90"
								orderId={order.id}
								currentSubStatus={order.subStatus}
							/>
						</div>
					)}

					{order.subStatus === "ORDER_PLACED" && (
						<div className="flex-1">
							<AcceptOrder orderId={order.id} />
						</div>
					)}

					{order.status === "CANCELLED" && (
						<ViewCancellation
							triggerClassName="w-full"
							reason={order.cancellationReason || ""}
							subStatus={order.subStatus}
						/>
					)}

					{/* {order.status === "COMPLETED" &&
						order.subStatus === "BUYER_REVIEWED" && (
							<Button
								// asChild
								onClick={() => toast.info("Coming soon...")}
								className="flex flex-1 items-center"
								variant={"outline"}
							>
								View Rating
							</Button>
						)} */}
				</div>
			</div>
		</div>
	)
}
