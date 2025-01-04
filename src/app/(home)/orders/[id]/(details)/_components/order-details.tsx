import { AddressDetailsDrawerDialog } from "@/app/dashboard/(admin)/users/(lists)/_components/address-details"
import { FPContactNumberDisplay } from "@/components/fp/fp-contact-number"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getOrder } from "@/data-access/orders"
import { formatPHP } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
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
				<CardHeader className="p-3 pb-2">
					<CardTitle className="text-base font-normal">
						Your Contact Information
					</CardTitle>
					<CardDescription className="sr-only">
						Customer contact information
					</CardDescription>
				</CardHeader>
				<CardContent className="p-3 pt-0">
					<div className="flex justify-between">
						<div className="flex items-center gap-1">
							<h2 className="font-semibold text-foreground">
								{order.customerContact?.contactName}
							</h2>
						</div>
					</div>
					<div className="space-y-1 text-sm">
						{order.customerContact?.contactNumber && (
							<div className="flex items-center gap-1">
								<FPContactNumberDisplay
									contactNumber={order.customerContact.contactNumber}
								/>
							</div>
						)}
						<div className="flex items-center gap-1">
							<div>
								<span className="">{order.customerContact?.fullAddress}</span>
								<AddressDetailsDrawerDialog
									address={{
										fullAddress: order.customerContact?.fullAddress || "",
										longitude: order.customerContact?.longitude || 0,
										latitude: order.customerContact?.latitude || 0
									}}
									title={`${order.farmer?.farmName}'s Location`}
								/>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
			<Card className="border-none">
				<CardHeader className="sr-only p-3">
					<CardTitle className="sr-only text-base font-normal">
						Farmer Information
					</CardTitle>
					<CardDescription className="sr-only">
						Farmer contact information
					</CardDescription>
				</CardHeader>
				<CardContent className="p-3">
					<div className="flex justify-between">
						<Link href={`/farmers/${order.farmer?.id}`}>
							<div className="flex items-center gap-1">
								<h2 className="font-semibold text-foreground">
									{order.farmer?.farmName}
								</h2>
								<ChevronRight className="h-4 w-4" />
							</div>
						</Link>
					</div>
					<div className="space-y-1 text-sm">
						{order.farmer?.contactNumber && (
							<div className="flex items-center gap-1">
								<FPContactNumberDisplay
									contactNumber={order.farmer?.contactNumber}
								/>
							</div>
						)}
						<div className="flex items-center gap-1">
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
					<Separator className="my-3" />
					<div className="w-full">
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
