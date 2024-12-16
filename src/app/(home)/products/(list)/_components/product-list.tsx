import { ProductCard } from "@/app/(home)/_components"
import { getProductsOnProductListPageUseCase } from "@/use-cases/products"
import { Box } from "lucide-react"
import Link from "next/link"
import { searchParamsCache } from "../searchParams"

export async function ProductList() {
	const { search, sortBy } = searchParamsCache.all()

	const products = await getProductsOnProductListPageUseCase({
		search,
		sortBy
	})

	return (
		<>
			{products.length > 0 ? (
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
					{products.map((product, index) => (
						<Link
							href={`/products/${product.slug}`}
							key={index}
							className="inline-block h-full w-full"
							prefetch
						>
							<ProductCard
								sold={product.totalSold}
								description={product.description}
								image={product.productImages[0] || "/placeholder.svg"}
								title={product.title}
								averageRating={product.averageRating}
								reviews={product._count.reviews}
								price={product.price}
								farmer={product.farmer?.user.name || ""}
								unit={product.unit || "kg"}
								className="border-none shadow-none"
							/>
						</Link>
					))}
				</div>
			) : (
				<div className="h-[calc(100vh-164px)]">
					<div className="flex flex-col items-center justify-center pt-20 text-muted-foreground">
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
