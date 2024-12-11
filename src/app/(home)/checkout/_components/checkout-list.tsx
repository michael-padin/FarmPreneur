"use client"
import { AddressDetailsDrawerDialog } from "@/app/dashboard/(admin)/users/(lists)/_components/address-details"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import { formatPHP } from "@/lib/utils"
import { CartState } from "@/types/cart"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import { Fragment, useState } from "react"
import { PlaceOrder } from "./place-order"

export default function CartCheckOutList({
	checkoutData
}: {
	checkoutData: CartState
}) {
	const [newCheckoutData, setNewCheckoutData] =
		useState<CartState>(checkoutData)
	const [errors, setErrors] = useState<Record<number, boolean>>({})
	const [pickupLocationId, setPickupLocationId] = useState<string>("")

	const validateCheckout = () => {
		const newErrors = {} as Record<number, boolean>

		newCheckoutData.groupedItems.forEach((group, index) => {
			if (!group.pickupLocationId) {
				newErrors[index] = true
			}
		})

		setErrors(newErrors)

		if (Object.keys(newErrors).length > 0) {
			return false
		}

		return true
	}

	return (
		<>
			<ScrollArea className="flex-1 p-2">
				<div className="space-y-4 lg:container">
					{checkoutData?.groupedItems?.map((group, index) => (
						<Card key={group.farmer.id} className="border-none bg-background">
							<CardContent className="w-full space-y-2 p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<h2 className="text-lg font-semibold">
											{group.farmer.name}
										</h2>
										<ChevronRight className="h-4 w-4" />
									</div>
								</div>
								<div className="mb-2 flex items-center justify-between text-sm">
									<div className="w-full">
										<div className="flex justify-between">
											<div className="w-full">
												<Select
													onValueChange={(value) => {
														setNewCheckoutData((prev) => {
															return {
																...prev,
																groupedItems: [
																	...prev.groupedItems.map((group, i) => {
																		if (i === index) {
																			return {
																				...group,
																				pickupLocationId: value
																			}
																		}
																		return group
																	})
																]
															}
														})
														setPickupLocationId(value)

														// Clear error when a valid pickupLocationId is selected
														setErrors((prev) => {
															const newErrors = { ...prev }
															newErrors[index] = false
															return newErrors
														})
													}}
												>
													<Label htmlFor="pickup-location">
														Pickup Location
													</Label>
													<SelectTrigger
														className={`w-full ${
															errors[index]
																? "border-destructive text-destructive ring-destructive focus:ring-destructive"
																: ""
														}`}
														id="pickup-location"
													>
														<SelectValue placeholder="Select Pickup Location">
															<span className="mb-2">
																{
																	group.farmer.addresses.find(
																		(address) => address.id === pickupLocationId
																	)?.fullAddress
																}
															</span>
														</SelectValue>
													</SelectTrigger>
													<SelectContent>
														{group.farmer.addresses &&
														group.farmer.addresses?.length > 0 ? (
															group.farmer.addresses.map((address) => (
																<SelectItem key={address.id} value={address.id}>
																	<div className="flex flex-col">
																		<span className="truncate">
																			{address.fullAddress}
																		</span>
																	</div>
																</SelectItem>
															))
														) : (
															<SelectItem disabled value="#">
																No Address
															</SelectItem>
														)}
													</SelectContent>
												</Select>
												{pickupLocationId && (
													<AddressDetailsDrawerDialog
														address={
															group.farmer.addresses.find(
																(address) => address.id === pickupLocationId
															)!
														}
														title="Pickup Location"
													/>
												)}
											</div>
										</div>
									</div>
								</div>
								<div className="w-full space-y-4">
									{group.items.map((item) => (
										<Fragment key={item.product.id}>
											<div className="space-y-4">
												<div key={item.id} className="flex gap-4">
													<div className="relative h-24 w-24 overflow-hidden rounded-lg border">
														<Image
															src={item.product.image}
															alt={item.product.name}
															fill
															priority
															sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
															className="object-cover"
														/>
													</div>
													<div className="flex flex-1 flex-col gap-1">
														<div className="flex items-center justify-between">
															<h3 className="font-medium">
																{item.product.name}
															</h3>
														</div>
														<div className="mt-auto flex items-center justify-between">
															<div className="flex items-center gap-2">
																<p className="text-primary">
																	₱{formatPHP(item.product.price)}/
																	<span className="">{item.product.unit}</span>
																</p>
															</div>
															<div className="">
																<span className="">x{item.quantity}</span>
															</div>
														</div>
													</div>
												</div>
											</div>
										</Fragment>
									))}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</ScrollArea>

			{checkoutData.distinctProductsCount > 0 ? (
				<div className="sticky bottom-0 border-t bg-background">
					<div className="grid grid-cols-2 p-2 lg:container">
						<div className="flex items-center justify-center">
							<div className="text-lg">
								Total:{" "}
								<span className="font-semibold text-primary">
									₱{formatPHP(checkoutData.total)}
								</span>
							</div>
						</div>
						<PlaceOrder
							checkoutData={newCheckoutData}
							validateCheckout={validateCheckout}
						/>
					</div>
				</div>
			) : (
				""
			)}
		</>
	)
}
