import ProductCard from "@/app/(home)/_components/product-card"
import { ProductSort } from "@/app/(home)/products/(list)/searchParams"
import { getFarmerProductLists } from "@/data-access/products"
import { Box } from "lucide-react"
import Link from "next/link"

type Params = Promise<{ id: string }>

// this query is on the product list page
export const getFarmerProductListsUseCase = async (filter: {
	search?: string
	sortBy?: ProductSort
	farmerId?: string
}) => {
	const products = await getFarmerProductLists({
		search: filter.search,
		sortBy: filter.sortBy,
		farmerId: filter.farmerId
	})

	const shapedProducts = products.map((product) => {
		const totalSold = product.orderItem
			.filter((orderItem) => orderItem.order.status === "COMPLETED")
			.reduce((sum, item) => sum + item.quantity, 0)
		const averageRating =
			product.reviews.reduce((sum, review) => sum + review.rating, 0) /
				product.reviews.length || 0
		return {
			...product,
			totalSold,
			averageRating
		}
	})

	return shapedProducts
}

export async function FarmerProducts({ params }: { params: Params }) {
	const farmerId = (await params).id
	const products = await getFarmerProductListsUseCase({
		farmerId
	})

	return (
		<div className="w-full">
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
		</div>
	)
}
