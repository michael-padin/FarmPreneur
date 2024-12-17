import { AddressDetailsDrawerDialog } from "@/app/dashboard/(admin)/users/(lists)/_components/address-details"
import { OrderStatusBadge } from "@/app/dashboard/(admin)/users/(lists)/_components/badges"
import { FPContactNumberDisplay } from "@/components/fp/fp-contact-number"
import { Card, CardContent } from "@/components/ui/card"
import { formatPHP } from "@/lib/utils"
import { getFarmerOrdersUseCase } from "@/use-cases/orders"
import { MapPin, PhoneCall } from "lucide-react"
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
		<Card key={order.farmer.id} className="border-none bg-background">
			<CardContent className="w-full space-y-3 p-2">
				<div className="rounded-lg bg-muted p-2 text-muted-foreground">
					<div className="flex justify-between">
						<div className="flex items-center gap-2">
							<h2 className="font-semibold text-foreground">
								{order.customer?.user.name}
							</h2>
							{/* <ChevronRight className="h-4 w-4" /> */}
						</div>
						<OrderStatusBadge status={order.status} showText />
					</div>
					<div className="my-2 space-y-2 text-sm">
						{order.customerContact?.contactNumber && (
							<div className="flex items-center gap-2">
								<PhoneCall className="h-4 w-4" />
								<FPContactNumberDisplay
									contactNumber={order.customerContact?.contactNumber || ""}
								/>
							</div>
						)}
						<div className="flex items-center gap-2">
							<MapPin className="h-5 w-5" />
							<div>
								<span className="">{order.customerContact?.fullAddress}</span>

								<AddressDetailsDrawerDialog
									address={{
										fullAddress: order.customerContact?.fullAddress || "",
										longitude: order.customerContact?.longitude || 0,
										latitude: order.customerContact?.latitude || 0
									}}
									title={`${order.customer?.user.name}'s Location`}
								/>
							</div>
						</div>
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
						{order.status !== "CANCELLED" && order.status !== "COMPLETED" && (
							<CancelOrder orderId={order.id} status={order.status} />
						)}
						{order.status === "IN_PROGRESS" && (
							<SubStatusSelect
								orderId={order.id}
								currentSubStatus={order.subStatus || "PREPARING_PRODUCE"}
							/>
						)}
						{order.status === "PENDING" && <AcceptOrder orderId={order.id} />}
						{order.status === "CANCELLED" && (
							<ViewCancellation
								reason={order.cancellationReason || ""}
								subStatus={order.subStatus || "CANCELLED_BY_FARMER"}
							/>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
