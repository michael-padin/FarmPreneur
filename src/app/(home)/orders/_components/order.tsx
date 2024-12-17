import { AddressDetailsDrawerDialog } from "@/app/dashboard/(admin)/users/(lists)/_components/address-details"
import { OrderStatusBadge } from "@/app/dashboard/(admin)/users/(lists)/_components/badges"
import { FPContactNumberDisplay } from "@/components/fp/fp-contact-number"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatPHP } from "@/lib/utils"
import { getCustomerOrdersUseCase } from "@/use-cases/orders"
import { MapPin, PhoneCall } from "lucide-react"
import Image from "next/image"
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
		<Card key={order.farmer.id} className="border-none bg-background">
			<CardContent className="w-full space-y-3 p-2">
				<div className="rounded-lg bg-muted p-2 text-muted-foreground">
					<div className="flex justify-between">
						<div className="flex items-center gap-2">
							<Image
								src={order.farmer?.profilePicture || "/placeholder.svg"}
								alt={`${order.farmer?.farmName}'s Profile picture`}
								width={30}
								height={30}
								className="rounded-full"
							/>
							<h2 className="font-semibold text-foreground">
								{order.farmer?.farmName}
							</h2>
							{/* <ChevronRight className="h-4 w-4" /> */}
						</div>
						<OrderStatusBadge status={order.status} showText />
					</div>
					<div className="my-2 space-y-2 text-sm">
						{order.farmer?.contactNumber && (
							<div className="flex items-center gap-2">
								<PhoneCall className="h-4 w-4" />
								<FPContactNumberDisplay
									contactNumber={order.farmer?.contactNumber}
								/>
							</div>
						)}
						<div className="flex items-center gap-2">
							<MapPin className="h-5 w-5" />
							<div>
								<span className="">
									{order.farmer?.address[0]?.fullAddress}
								</span>

								<AddressDetailsDrawerDialog
									address={{
										fullAddress: order.farmer?.address[0]?.fullAddress || "",
										longitude: order.farmer?.address[0]?.longitude || 0,
										latitude: order.farmer?.address[0]?.latitude || 0
									}}
									title={`${order.farmer?.farmName}'s Location`}
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
						{order.status === "CANCELLED" && (
							<ViewCancellation
								reason={order.cancellationReason || ""}
								subStatus={order.subStatus || "CANCELLED_BY_FARMER"}
							/>
						)}
						{order.subStatus === "PICKED_UP" && (
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
