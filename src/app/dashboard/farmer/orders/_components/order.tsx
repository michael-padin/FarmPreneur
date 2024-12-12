import { OrderStatusBadge } from "@/app/dashboard/(admin)/users/(lists)/_components/badges"
import { Card, CardContent } from "@/components/ui/card"
import { formatPHP } from "@/lib/utils"
import { getFarmerOrdersUseCase } from "@/use-cases/orders"
import { ChevronRight } from "lucide-react"
import { Fragment } from "react"
import { AcceptOrder } from "./accept-order"
import { CancelOrder } from "./cancel-order"
import { OrderItem } from "./order-item"
import { ViewCancellation } from "./view-cancellation"

export default function Order({
	order
}: {
	order: Awaited<ReturnType<typeof getFarmerOrdersUseCase>>[0]
}) {
	return (
		<Card key={order.farmer.id} className="border-none bg-background">
			<CardContent className="w-full space-y-3 p-2">
				<div className="">
					<div className="flex justify-between">
						<div className="flex items-center gap-2">
							<h2 className="font-semibold">{order.customer?.user.name}</h2>
							<ChevronRight className="h-4 w-4" />
						</div>
						<OrderStatusBadge status={order.status} showText />
					</div>
					<div className="text-xs">
						<div className="flex gap-1">
							{/* <MapPin className="h-5 w-5" />
							<div>
								<span className="text-muted-foreground">
									{order.pickupLocation?.fullAddress}
								</span>

								<AddressDetailsDrawerDialog
									address={{
										fullAddress: order.pickupLocation?.fullAddress || "",
										longitude: order.pickupLocation?.longitude || 0,
										latitude: order.pickupLocation?.latitude || 0
									}}
									title="Pickup Location"
								/>
							</div> */}
						</div>
						{order.customer?.contactNumber && (
							<p>Contact: {order.customer?.contactNumber}</p>
						)}
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
				<div className="flex items-center justify-end">
					<div className="flex gap-2 pt-2">
						{order.status === "PENDING" && <AcceptOrder orderId={order.id} />}
						{order.status !== "CANCELLED" && (
							<CancelOrder orderId={order.id} status={order.status} />
						)}
						{order.status === "CANCELLED" && (
							<ViewCancellation reason={order.cancellationReason || ""} />
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
