"use client"
import { AddressDetailsDrawerDialog } from "@/app/dashboard/(admin)/users/(lists)/_components/address-details"
import { FPContactNumberDisplay } from "@/components/fp/fp-contact-number"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { locationLabelMap, LocationType } from "@/constants/address"
import { formatPHP } from "@/lib/utils"
import { CartState } from "@/types/cart"
import { getDefaultAddressByCustomerId } from "@/use-cases/address"
import { ChevronRight, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Fragment } from "react"
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
	const validateCheckout = () => !!defaultCustomerAddress

	return (
		<>
			<ScrollArea className="flex-1 p-2">
				<div className="space-y-2 lg:container">
					<Card className="border-none bg-background">
						<div className="flex justify-between p-3 pb-0">
							<CardHeader className="p-0">
								<CardTitle className="text-base font-normal">
									Your Contact Information
								</CardTitle>
								<CardDescription className="sr-only">
									Customer contact information
								</CardDescription>
							</CardHeader>
							<Link href={`/profile/address`} className="text-primary">
								<span className="">Edit</span>
							</Link>
						</div>
						<CardContent className="w-full space-y-2 p-3">
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
											<div className="space-y-2 text-sm">
												<div className="flex gap-2">
													<div>
														<span className="">
															{defaultCustomerAddress?.fullAddress}
														</span>

														<AddressDetailsDrawerDialog
															address={{
																fullAddress:
																	defaultCustomerAddress?.fullAddress,
																longitude:
																	defaultCustomerAddress?.longitude || 0,
																latitude: defaultCustomerAddress?.latitude || 0
															}}
															title={`${defaultCustomerAddress?.contactName} Location`}
														/>
													</div>
												</div>
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
						<Card className="border-none" key={index}>
							<CardHeader className="p-3 pb-0">
								<CardTitle className="text-base font-normal">
									Farmer Information
								</CardTitle>
								<CardDescription className="sr-only">
									Farmer contact information
								</CardDescription>
							</CardHeader>
							<CardContent className="w-full p-3">
								<div className="flex flex-grow">
									<MapPin className="mr-2 mt-1 h-4 w-4 text-primary" />
									<div>
										<div className="flex">
											<Link
												href={`/farmers/${group.farmer?.id}`}
												className="flex items-center"
											>
												<div className="flex items-center gap-1">
													<h2 className="font-semibold text-foreground">
														{group.farmer?.name}
													</h2>
													<ChevronRight className="h-4 w-4" />
												</div>
											</Link>
										</div>

										<div className="space-y-2 text-sm">
											<div className="flex gap-2">
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
															latitude:
																group?.farmer.addresses[0]?.latitude || 0
														}}
														title={`${group.farmer?.name} Location`}
													/>
												</div>
											</div>
											{group.farmer?.contactNumber && (
												<div className="flex items-center gap-1 text-muted-foreground">
													<FPContactNumberDisplay
														contactNumber={group.farmer?.contactNumber}
													/>
												</div>
											)}
										</div>
									</div>
								</div>
								<Separator className="my-3" />
								<div className="w-full space-y-3">
									{group.items.map((item) => (
										<Fragment key={item.product.id}>
											<div className="space-y-4">
												<div key={item.id} className="flex gap-4">
													<div className="relative h-20 w-20 overflow-hidden rounded-lg border">
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

								<div className="flex items-center justify-end pt-3">
									<p>
										Total:{" "}
										<span className="font-semibold">
											₱
											{formatPHP(
												Number(
													group.items.reduce(
														(sum, b) => sum + b.product.price * b.quantity,
														0
													)
												)
											)}
										</span>
									</p>
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
							checkoutData={checkoutData}
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
