"use client"
import { AddressDetailsDrawerDialog } from "@/app/dashboard/(admin)/users/(lists)/_components/address-details"
import { FPContactNumberDisplay } from "@/components/fp/fp-contact-number"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { locationLabelMap, LocationType } from "@/constants/address"
import { formatPHP } from "@/lib/utils"
import { CartState } from "@/types/cart"
import { getDefaultAddressByCustomerId } from "@/use-cases/address"
import { MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Fragment, useState } from "react"
import { PlaceOrder } from "./place-order"

export default function CartCheckOutList({
	checkoutData,
	defaultCustomerAddress
}: {
	checkoutData: CartState
	defaultCustomerAddress: Awaited<
		ReturnType<typeof getDefaultAddressByCustomerId>
	>
}) {
	const [newCheckoutData, setNewCheckoutData] =
		useState<CartState>(checkoutData)
	const [errors, setErrors] = useState<Record<number, boolean>>({})
	const [pickupLocationId, setPickupLocationId] = useState<string>("")

	const validateCheckout = () => {
		// const newErrors = {} as Record<number, boolean>

		// newCheckoutData.groupedItems.forEach((group, index) => {
		// 	if (!group.pickupLocationId) {
		// 		newErrors[index] = true
		// 	}
		// })

		// setErrors(newErrors)

		// if (Object.keys(newErrors).length > 0) {
		// 	return false
		// }

		if (!defaultCustomerAddress) {
			return false
		}

		return true
	}

	return (
		<>
			<ScrollArea className="flex-1 p-2">
				<div className="space-y-2 lg:container">
					<Card className="border-none bg-background">
						<CardContent className="w-full space-y-2 p-2">
							{defaultCustomerAddress ? (
								<div className="flex justify-between">
									<div className="flex flex-grow">
										<MapPin className="mr-2 mt-1 h-4 w-4 text-primary" />
										<div className="">
											<Label
												htmlFor={`address-${defaultCustomerAddress.id}`}
												className="flex items-center text-base font-semibold"
											>
												{
													locationLabelMap[
														defaultCustomerAddress.label as LocationType
													]
												}
											</Label>
											<div className="space-y-2">
												<p className="text-sm text-muted-foreground">
													{defaultCustomerAddress.fullAddress}
												</p>
												<div className="">
													<p className="text-sm">
														{defaultCustomerAddress?.contactName}
													</p>
													{defaultCustomerAddress.contactNumber && (
														<p className="text-sm text-muted-foreground">
															<FPContactNumberDisplay
																contactNumber={
																	defaultCustomerAddress.contactNumber
																}
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
									<Link href={`/profile/address`} className="text-primary">
										<span className="">Edit</span>
									</Link>
								</div>
							) : (
								<Button variant={"outline"} asChild className="w-full">
									<Link href="/profile/address?from=cart" prefetch>
										Add contact info
									</Link>
								</Button>
							)}
						</CardContent>
					</Card>
					{checkoutData?.groupedItems?.map((group, index) => (
						<Card key={group.farmer.id} className="border-none bg-background">
							<CardContent className="w-full space-y-2 p-2">
								<div className="rounded-lg bg-muted p-2 text-muted-foreground">
									<div className="flex justify-between">
										<div className="flex items-center gap-2">
											<Image
												src={group.farmer?.profilePicture || "/placeholder.svg"}
												alt={group.farmer?.name}
												width={30}
												height={30}
												className="rounded-full"
											/>
											<h2 className="font-semibold text-foreground">
												{group.farmer?.name}
											</h2>
											{/* <ChevronRight className="h-4 w-4" /> */}
										</div>
									</div>
									<div className="my-2 space-y-2 text-sm">
										<div className="flex gap-2">
											<MapPin className="mt-1 h-4 w-4 text-primary" />
											<div>
												<span className="">
													{group?.farmer.addresses[0]?.fullAddress}
												</span>

												<AddressDetailsDrawerDialog
													address={{
														fullAddress:
															group?.farmer.addresses[0]?.fullAddress,
														longitude:
															group?.farmer.addresses[0]?.longitude || 0,
														latitude: group?.farmer.addresses[0]?.latitude || 0
													}}
													title={`${group.farmer?.name}'s Farm Location`}
												/>
											</div>
										</div>
										{group.farmer?.contactNumber && (
											<div className="flex items-center gap-2">
												<div className="h-4 w-4 text-primary" />
												<FPContactNumberDisplay
													contactNumber={group.farmer?.contactNumber}
												/>
											</div>
										)}
									</div>
								</div>
								<div className="mb-2 flex items-center justify-between text-sm">
									<div className="w-full">
										<div className="flex justify-between">
											<div className="w-full">
												{/* <Select
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
												</Select> */}
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
							customerContactId={defaultCustomerAddress?.id || ""}
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
