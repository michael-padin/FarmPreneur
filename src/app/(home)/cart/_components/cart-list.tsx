"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCart } from "@/contexts/cart-context"
import { formatPHP } from "@/lib/utils"
import { ArrowLeft, ChevronRight, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DeleteItemButton } from "./delete-item-button"
import { EditItemQuantityButton } from "./edit-quantity-button"

export default function CartListPage() {
	const router = useRouter()
	const { removeItem, updateQuantity, cart } = useCart()

	return (
		<div className="flex min-h-screen flex-col">
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="flex h-14 items-center p-2 lg:container">
					<div className="flex flex-1 items-center justify-between">
						<div className="flex items-center gap-2">
							<button
								className="cursor-pointer hover:bg-transparent hover:text-current"
								onClick={() => router.back()}
							>
								<ArrowLeft className="h-6 w-6" />
							</button>
							<h1 className="text-xl font-semibold">
								Shopping Cart ({cart.distinctProductsCount})
							</h1>
						</div>
					</div>
				</div>
			</header>

			{cart.distinctProductsCount > 0 ? (
				<>
					<ScrollArea className="flex-1 p-2">
						<div className="space-y-4 lg:container">
							{cart.groupedItems.map((group) => (
								<Card
									key={group.farmer.id}
									className="border-none bg-background"
								>
									<CardContent className="space-y-2 p-3">
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

										<div className="space-y-3">
											{group.items.map((item) => (
												<div className="space-y-4" key={item.id}>
													<div key={item.id} className="flex gap-3">
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
																<DeleteItemButton
																	itemId={item.id}
																	removeItem={removeItem}
																/>
															</div>

															<div className="mt-auto flex items-center justify-between">
																<div className="flex items-center gap-2">
																	<p className="text-primary">
																		₱{formatPHP(item.product.price)}/
																		<span className="">
																			{item.product.unit}
																		</span>
																	</p>
																</div>
																<div className="ml-auto flex h-9 flex-row items-center rounded-lg border border-neutral-200 dark:border-neutral-700">
																	<EditItemQuantityButton
																		type="minus"
																		item={{
																			id: item.id,
																			quantity: item.quantity
																		}}
																		optimisticUpdate={updateQuantity}
																	/>
																	<span className="text-base font-medium">
																		{item.quantity}
																	</span>
																	<EditItemQuantityButton
																		type="plus"
																		item={{
																			id: item.id,
																			quantity: item.quantity
																		}}
																		optimisticUpdate={updateQuantity}
																	/>
																</div>
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</ScrollArea>

					<div className="sticky bottom-0 border-t bg-background">
						<div className="grid grid-cols-2 p-2 lg:container">
							<div className="flex items-center justify-center">
								<div className="text-lg">
									Total:{" "}
									<span className="font-semibold text-primary">
										₱{formatPHP(cart.total)}
									</span>
								</div>
							</div>
							<Button className="w-full" size="lg" asChild>
								<Link href="/checkout?from=cart">
									Check Out ({cart.distinctProductsCount})
								</Link>
							</Button>
						</div>
					</div>
				</>
			) : (
				<div className="flex h-full flex-col items-center justify-center pt-20 text-muted-foreground">
					<div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-background">
						<ShoppingCart className="h-8 w-8 text-primary" />
					</div>
					<p className="text-sm">No items in cart</p>
				</div>
			)}
		</div>
	)
}
