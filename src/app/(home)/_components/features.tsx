import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { getDailyProductsUseCase } from "@/use-cases/products"
import { Box } from "lucide-react"
import Link from "next/link"
import ProductCard from "./product-card"

export async function Features() {
	const products = await getDailyProductsUseCase()
	return (
		<section className="mx-auto rounded-lg px-0 lg:container lg:px-4">
			<div className="rounded-lg bg-background">
				<div className="relative rounded-md bg-background py-2">
					<h3 className="mb-2 px-2 font-semibold lg:text-2xl">
						Featured Products
					</h3>
					<div>
						<div className="">
							<ScrollArea className="overflow-hidden">
								<div className="flex gap-2">
									{products.length > 0 ? (
										products.map((product, index) => (
											<Link
												href={`/products/${product.slug}`}
												key={index}
												className="inline-block h-full w-full truncate first:pl-2 last:pr-2"
												prefetch
											>
												<ProductCard
													description={product.description}
													image={product.images[0].url || "/placeholder.svg"}
													title={product.title}
													averageRating={product.averageRating}
													reviews={product._count.reviews}
													price={product.price}
													farmer={product.farmer?.user.name || ""}
													unit={product.unit || "kg"}
													className="border-none shadow-none"
												/>
											</Link>
										))
									) : (
										<div className="pt-20">
											<div className="flex h-full flex-col items-center justify-center text-muted-foreground">
												<div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-background">
													<Box className="h-8 w-8 text-primary" />
												</div>
												<p className="text-sm">No products found</p>
											</div>
										</div>
									)}
								</div>
								<ScrollBar orientation="horizontal" className="invisible" />
							</ScrollArea>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
