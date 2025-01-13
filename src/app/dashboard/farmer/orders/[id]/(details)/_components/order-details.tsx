import { AddressDetailsDrawerDialog } from "@/app/dashboard/(admin)/users/(lists)/_components/address-details"
import { FPContactNumberDisplay } from "@/components/fp/fp-contact-number"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { locationLabelMap, LocationType } from "@/constants/address"
import { getOrder } from "@/data-access/orders"
import { formatPHP } from "@/lib/utils"
import { MapPin } from "lucide-react"
import { Fragment } from "react"
import { OrderItem } from "./order-item"
import { OrderTimeline } from "./order-timeline"

interface OrderDetailsProps {
	order: Awaited<ReturnType<typeof getOrder>>
}

export function OrderDetails({ order }: OrderDetailsProps) {
	return (
		<div className="space-y-2">
			<OrderTimeline timeline={order.statusHistory} />
			<Card className="border-none">
				<CardHeader className="p-3">
					<CardTitle className="text-base font-normal">
						Customer Contact Information
					</CardTitle>
					<CardDescription className="sr-only">
						Customer contact information
					</CardDescription>
				</CardHeader>
				<CardContent className="p-3 pt-0">
					<div className="flex justify-between">
						<div className="flex flex-grow">
							<MapPin className="mr-2 mt-1 h-4 w-4 text-primary" />
							<div className="">
								<Label
									htmlFor={`address-${order.customerContact?.id}`}
									className="flex items-center text-base font-semibold"
								>
									{
										locationLabelMap[
											order.customerContact?.label as LocationType
										]
									}
								</Label>
								<div className="space-y-2 text-sm">
									<div className="flex gap-2">
										<div>
											<span className="">
												{order.customerContact?.fullAddress}
											</span>

											<AddressDetailsDrawerDialog
												address={{
													fullAddress: order.customerContact?.fullAddress,
													longitude: order.customerContact?.longitude || 0,
													latitude: order.customerContact?.latitude || 0
												}}
												title={`${order.customerContact?.contactName} Location`}
											/>
										</div>
									</div>
									<div className="">
										<p className="text-sm">
											{order.customerContact?.contactName}
										</p>
										{order.customerContact?.contactNumber && (
											<p className="text-sm text-muted-foreground">
												<FPContactNumberDisplay
													contactNumber={order.customerContact.contactNumber}
												/>
											</p>
										)}
									</div>
									{/* <p className="text-sm">
												Note:{" "}
												<span className="text-muted-foreground">
													{defaultCustomerAddress.note}
												</span>
											</p> */}
								</div>
							</div>
						</div>
					</div>
					{order.orderNote && (
						<div className="my-2">
							<Label>Customer note:</Label>
							<div className="rounded-lg border p-2">{order.orderNote}</div>
						</div>
					)}
				</CardContent>
			</Card>
			<Card className="border-none">
				<CardHeader className="p-3">
					<CardTitle className="text-base font-normal">
						Your Information
					</CardTitle>
					<CardDescription className="sr-only">
						Farmer contact information
					</CardDescription>
				</CardHeader>
				<CardContent className="p-3 pt-0">
					<div className="flex flex-grow">
						<MapPin className="mr-2 mt-1 h-4 w-4 text-primary" />
						<div>
							<div className="flex">
								<div className="flex items-center gap-1">
									<h2 className="font-semibold text-foreground">
										{order.farmer?.farmName}
									</h2>
								</div>
							</div>

							<div className="space-y-2 text-sm">
								<div className="flex gap-2">
									<div>
										<span className="">
											{order.farmer.address[0].fullAddress}
										</span>

										<AddressDetailsDrawerDialog
											address={{
												fullAddress: order.farmer.address[0].fullAddress,
												longitude: order.farmer.address[0].longitude || 0,
												latitude: order?.farmer.address[0].latitude || 0
											}}
											title={`${order.farmer?.name} Location`}
										/>
									</div>
								</div>
								{order.farmer?.contactNumber && (
									<div className="flex items-center gap-1 text-muted-foreground">
										<FPContactNumberDisplay
											contactNumber={order.farmer?.contactNumber}
										/>
									</div>
								)}
							</div>
						</div>
					</div>
					<Separator className="my-3" />
					<div className="w-full space-y-3">
						{order.items.map((item) => (
							<Fragment key={item.id}>
								<OrderItem item={item} />
							</Fragment>
						))}
					</div>

					<div className="flex items-center justify-end pt-3">
						<p>
							Order Total:{" "}
							<span className="font-semibold">
								₱{formatPHP(Number(order.totalPrice))}
							</span>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
