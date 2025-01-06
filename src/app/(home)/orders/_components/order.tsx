import { OrderStatusBadge } from "@/app/dashboard/(admin)/users/(lists)/_components/badges"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatPHP } from "@/lib/utils"
import { getCustomerOrdersUseCase } from "@/use-cases/orders"
import Link from "next/link"
import { Fragment } from "react"
import { CancelOrder } from "./cancel-order"
import { ConfirmPickedUpOrder } from "./confirm-picked-up-order"
import { OrderItem } from "./order-item"
import { ViewCancellation } from "./view-cancellation"

export default function Order({
	order
}: {
	order: Awaited<ReturnType<typeof getCustomerOrdersUseCase>>[0]
}) {
	return (
		<Card
			key={order.farmer.id}
			className="hover:border-1 border-0 bg-background hover:shadow-lg"
		>
			<CardContent className="w-full space-y-3 p-3">
				<Link href={`/orders/${order.id}`} prefetch>
					<div className="rounded-lg pb-3 text-muted-foreground">
						<div className="flex justify-between">
							<div className="flex items-center gap-2">
								{/* <Image
									src={order.farmer?.profilePicture || "/placeholder.svg"}
									alt={`${order.farmer?.farmName}'s Profile picture`}
									width={25}
									height={25}
									className="rounded-full"
								/> */}
								<h2 className="font-semibold text-foreground">
									{order.farmer?.farmName}
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
					<div className="flex items-center justify-end pt-3">
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
						{order.status === "CANCELLED" && (
							<ViewCancellation
								reason={order.cancellationReason || ""}
								subStatus={order.subStatus}
							/>
						)}
						{order.subStatus === "PICKED_UP_BY_BUYER" && (
							<ConfirmPickedUpOrder orderId={order.id} />
						)}
						{order.status === "COMPLETED" &&
							!["BUYER_REVIEWED"].includes(order.subStatus || "") && (
								<Button asChild className="flex items-center">
									<Link href={`/orders/${order.id}/rate`} prefetch>
										Rate Order
									</Link>
								</Button>
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
