import { OrderStatusBadge } from "@/app/dashboard/(admin)/users/(lists)/_components/badges"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatPHP } from "@/lib/utils"
import { getFarmerOrdersUseCase } from "@/use-cases/orders"
import Link from "next/link"
import { Fragment } from "react"
import { AcceptOrder } from "./accept-order"
import { CancelOrder } from "./cancel-order"
import { OrderItem } from "./order-item"
import { SubStatusSelect } from "./sub-status-select"
import { ViewCancellation } from "./view-cancellation"

export default function Order({
	order
}: {
	order: Awaited<ReturnType<typeof getFarmerOrdersUseCase>>[0]
}) {
	return (
		<Card
			key={order.farmer.id}
			className="hover:border-1 border-0 bg-background hover:shadow-lg"
		>
			<CardContent className="w-full space-y-3 p-3">
				<Link href={`/dashboard/farmer/orders/${order.id}`}>
					<div className="rounded-lg pb-3 text-muted-foreground">
						<div className="flex justify-between">
							<div className="flex items-center gap-2">
								<h2 className="font-semibold text-foreground">
									{order.customer?.name}
								</h2>
								{/* <ChevronRight className="h-4 w-4" /> */}
							</div>
							<OrderStatusBadge status={order.status} showText />
						</div>
					</div>
					<div className="w-full space-y-3">
						{order.items.map((item, index) => (
							<Fragment key={item.id}>
								<OrderItem item={item} />
							</Fragment>
						))}
					</div>
					<div className="flex items-center justify-end">
						<p>
							Total:{" "}
							<span className="font-semibold">
								₱{formatPHP(Number(order.totalPrice))}
							</span>
						</p>
					</div>
				</Link>
				<div className="flex items-center justify-end">
					<div className="flex gap-2 pt-2">
						{order.status !== "CANCELLED" && order.status !== "COMPLETED" && (
							<CancelOrder orderId={order.id} status={order.status} />
						)}
						{order.status === "IN_PROGRESS" && (
							<SubStatusSelect
								triggerClassName="bg-primary text-primary-foreground hover:bg-primary/90"
								orderId={order.id}
								currentSubStatus={order.subStatus || "PREPARING_PRODUCE"}
							/>
						)}
						{order.status === "PENDING" && <AcceptOrder orderId={order.id} />}
						{order.status === "CANCELLED" && (
							<ViewCancellation
								reason={order.cancellationReason || ""}
								subStatus={order.subStatus}
							/>
						)}

						{order.status === "COMPLETED" &&
							order.subStatus === "BUYER_REVIEWED" && (
								<Button
									// asChild
									// onClick={() => toast.info("Coming soon...")}
									className="flex items-center"
									variant={"outline"}
								>
									{/* <Link href={`/orders/${order.id}/rate`} prefetch> */}
									View Rating
									{/* </Link> */}
								</Button>
							)}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
