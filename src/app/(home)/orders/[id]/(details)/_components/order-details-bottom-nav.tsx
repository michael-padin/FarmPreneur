"use client"
import { Button } from "@/components/ui/button"
import { getOrder } from "@/data-access/orders"
import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { CancelOrder } from "../../../_components/cancel-order"
import { ConfirmPickedUpOrder } from "../../../_components/confirm-picked-up-order"
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
					<Button variant="outline" size={"icon"}>
						<Link href={`/messages/${order.farmer.userId}`}>
							<MessageCircle />
						</Link>
					</Button>
					{canBeCancelled && (
						<CancelOrder
							orderId={order.id}
							status={order.status}
							triggerClassName="w-full"
						/>
					)}
					{order.status === "CANCELLED" && (
						<ViewCancellation
							triggerClassName="w-full"
							reason={order.cancellationReason || ""}
							subStatus={order.subStatus}
						/>
					)}
					{order.subStatus === "PICKED_UP_BY_BUYER" && (
						<ConfirmPickedUpOrder orderId={order.id} />
					)}
					{order.status === "COMPLETED" &&
						!["BUYER_REVIEWED"].includes(order.subStatus || "") && (
							<Button asChild className="flex-grow">
								<Link href={`/orders/${order.id}/rate`} prefetch>
									Rate Order
								</Link>
							</Button>
						)}
					{order.status === "COMPLETED" &&
						order.subStatus === "BUYER_REVIEWED" && (
							<Button
								// asChild
								onClick={() => toast.info("Coming soon...")}
								className="flex flex-1 items-center"
								variant={"outline"}
							>
								{/* <Link href={`/orders/${order.id}/rate`} prefetch> */}
								View Rating
								{/* </Link> */}
							</Button>
						)}
				</div>
			</div>
		</div>
	)
}
