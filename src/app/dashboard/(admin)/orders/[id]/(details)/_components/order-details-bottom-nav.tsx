"use client"
import { CancelOrder } from "@/app/(home)/orders/_components/cancel-order"
import { AcceptOrder } from "@/app/dashboard/farmer/orders/_components/accept-order"
import { SubStatusSelect } from "@/app/dashboard/farmer/orders/_components/sub-status-select"
import { ViewCancellation } from "@/app/dashboard/farmer/orders/_components/view-cancellation"
import { getOrder } from "@/data-access/orders"
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
		<div className="w-full">
			<div className="flex w-full items-center">
				<div className="flex w-full gap-3">
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
