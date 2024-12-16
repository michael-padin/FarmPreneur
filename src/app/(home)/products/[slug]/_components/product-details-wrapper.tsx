import { QuantityProvider } from "@/contexts/quantity-context"
import { getProductBySlugUseCase } from "@/use-cases/products"
import { notFound } from "next/navigation"
import ProductBottomNav from "./bottom-nav"
import { Farmer } from "./farmer"
import { Gallery } from "./gallery"
import { ProductDetails } from "./product-details"

type Params = Promise<{ slug: string }>

export async function ProductDetailsWrapper(props: { params: Params }) {
	const params = await props.params
	const slug = params.slug

	if (!slug) {
		notFound()
	}
	const product = await getProductBySlugUseCase(slug)

	if (!product) {
		notFound()
	}
	return (
		<QuantityProvider stock={product.quantity}>
			<div className="space-y-4 pb-20">
				<div className="lg:gap-12b grid items-start lg:container md:grid-cols-2 lg:mx-auto lg:px-4">
					<div className="grid gap-4">
						<div className="bg-background">
							<Gallery images={product.productImages} title={product.title} />
						</div>
					</div>
					<ProductDetails product={product} />
				</div>
				<div className="bg-background p-4">
					<Farmer farmerId={product.farmer.id} />
				</div>
			</div>
			<ProductBottomNav product={product} />
		</QuantityProvider>
	)
}
