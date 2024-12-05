import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { getDailyProductsUseCase } from "@/use-cases/products"
import { Box } from "lucide-react"
import Link from "next/link"
import ProductCard from "./product-card"

export async function Features() {
	const products = await getDailyProductsUseCase()
	const images = products.map((product) => product.images?.[0].url || "")
	return (
		<section className="container mx-auto rounded-lg px-0 lg:px-4">
			<div className="rounded-lg bg-background p-2 py-4">
				<div className="relative rounded-md bg-background py-4 pl-4">
					<h3 className="mb-4 font-semibold lg:text-2xl"> Featured Products</h3>
					<div className="">
						<ScrollArea className="w-full whitespace-nowrap">
							<div className="flex gap-4">
								{products.length > 0 ? (
									products.map((product, index) => (
										<Link href={`/products/${product.slug}`} key={index}>
											<ProductCard
												description={product.description}
												images={images || "/placeholder.svg"}
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
		</section>
	)
}
