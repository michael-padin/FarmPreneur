import { FPBreadcrumbResponsive } from "@/components/fp/fp-breadcrumb"
import { QuantityProvider } from "@/contexts/quantity-context"
import { generateProductJsonLd } from "@/lib/structured-data"
import {
	getProductBySlugUseCase,
	getProductReviews
} from "@/use-cases/products"
import { notFound } from "next/navigation"
import ProductBottomNav from "./bottom-nav"
import { Farmer } from "./farmer"
import { Gallery } from "./gallery"
import { ProductDetails } from "./product-details"
import Reviews from "./reviews"

type Params = Promise<{ slug: string }>

export async function ProductDetailsWrapper(props: { params: Params }) {
	const params = await props.params
	const slug = params.slug

	if (!slug) {
		notFound()
	}
	const product = await getProductBySlugUseCase(slug)

	const reviews = await getProductReviews(product.id)

	const breadcrumbItems = [
		{ href: "/", label: "FarmPreneur" },
		{
			href: `/categories/${product.category.slug}`,
			label: product.category.name
		},
		{ label: product.title }
	]
	if (!product) {
		notFound()
	}

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(generateProductJsonLd(product))
				}}
			/>
			<QuantityProvider stock={product.quantity}>
				<div className="md:container">
					<div className="hidden md:block md:py-4">
						<FPBreadcrumbResponsive items={breadcrumbItems} />
					</div>
					<div className="space-y-4 pb-20">
						<div className="md:gap-12b grid items-start rounded-md md:container md:mx-auto md:grid-cols-2 md:bg-background md:p-0">
							<div className="grid gap-4 md:p-4">
								<div className="bg-background">
									<Gallery
										images={product.productImages}
										title={product.title}
									/>
								</div>
							</div>
							<div className="md:p-4">
								<ProductDetails product={product} />
							</div>
						</div>
						<div className="bg-background p-4 md:rounded-md">
							<Farmer farmerId={product.farmer.id} />
						</div>
						<div className="bg-background p-4 md:rounded-md" id="reviews">
							<Reviews reviews={reviews} />
						</div>
					</div>
					<div className="md:hidden">
						<ProductBottomNav product={product} />
					</div>
				</div>
			</QuantityProvider>
		</>
	)
}
