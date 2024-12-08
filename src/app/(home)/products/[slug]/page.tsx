import { QuantityProvider } from "@/contexts/quantity-context"
import { getProductBySlugUseCase } from "@/use-cases/products"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import ProductBottomNav from "./_components/bottom-nav"
import { Farmer } from "./_components/farmer"
import { Gallery } from "./_components/gallery"
import { GallerySkeleton } from "./_components/gallery-skeleton"
import { ProductDetails } from "./_components/product-details"
import { TopNav } from "./_components/top-nav"

type Params = Promise<{ slug: string }>

export default async function Page(props: { params: Params }) {
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
			<main className="relative bg-muted">
				<TopNav />
				<div className="space-y-4 pb-20">
					<div className="lg:gap-12b grid items-start lg:container md:grid-cols-2 lg:mx-auto lg:px-4">
						<div className="grid gap-4">
							<div className="bg-background">
								<Suspense fallback={<GallerySkeleton />}>
									<Gallery images={product.images} />
								</Suspense>
							</div>
						</div>
						<ProductDetails product={product} />
					</div>
					<div className="bg-background p-4">
						<Farmer farmerId={product.farmer.id} />
					</div>
				</div>
				<ProductBottomNav product={product} />
			</main>
		</QuantityProvider>
	)
}
