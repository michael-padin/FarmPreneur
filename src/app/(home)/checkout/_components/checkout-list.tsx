"use client"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatPHP } from "@/lib/utils"
import { CartState } from "@/types/cart"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import { Fragment } from "react"
import { PlaceOrder } from "./place-order"

export default function CartCheckOutList({
	checkoutData
}: {
	checkoutData: CartState
}) {
	return (
		<>
			<ScrollArea className="flex-1 p-2">
				<div className="space-y-4 lg:container">
					{checkoutData?.groupedItems?.map((group) => (
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

								<div className="w-full space-y-4">
									{group.items.map((item) => (
										<Fragment key={item.product.id}>
											<div className="mb-2 flex items-center justify-between text-sm">
												<div className="w-full">
													<div className="flex justify-between">
														<p className="">Pickup Location: </p>
														<button className="text-primary">View</button>
													</div>
													<span className="mb-2 text-muted-foreground">
														{item.product.pickupLocation.fullAddress}
													</span>
												</div>
											</div>
											<div className="space-y-4">
												<div key={item.id} className="flex gap-4">
													<div className="relative h-24 w-24 overflow-hidden rounded-lg border">
														<Image
															src={item.product.image}
															alt={item.product.name}
															fill
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
						<PlaceOrder checkoutData={checkoutData} />
					</div>
				</div>
			) : (
				""
			)}
		</>
	)
}
