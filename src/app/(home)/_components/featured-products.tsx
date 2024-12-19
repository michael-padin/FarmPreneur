import { getDailyProductsUseCase } from "@/use-cases/products"
import { Box } from "lucide-react"
import { FeaturedProductsCarousel } from "./featured-products-carousel"

export async function FeaturedProducts() {
	const products = await getDailyProductsUseCase()
	return (
		<>
			{products.length > 0 ? (
				<FeaturedProductsCarousel products={products} />
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
		</>
	)
}
