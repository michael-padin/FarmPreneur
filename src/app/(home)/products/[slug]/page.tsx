import { getProductBySlugUseCase } from "@/use-cases/products"
import { Metadata } from "next"
import { Suspense } from "react"
import ProductDetailsWrapperSkeleton from "./_components/product-details-skeleton"
import { ProductDetailsWrapper } from "./_components/product-details-wrapper"
import { TopNav } from "./_components/top-nav"

export const experimental_ppr = true

type Params = Promise<{ slug: string }>

export async function generateMetadata({
	params
}: {
	params: { productSlug: string }
}): Promise<Metadata> {
	const product = await getProductBySlugUseCase(params.productSlug)
	const title = `${product.title} | FarmPreneur`
	const description = `Buy fresh ${product.title} from ${product.farmer}. ${product.description}`

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: "website",
			images: [
				"/placeholder.svg",
				{
					url: product.productImages[0],
					width: 800,
					height: 600,
					alt: product.title
				}
			]
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [product.productImages[0]]
		}
	}
}

export default function Page(props: { params: Params }) {
	return (
		<main className="relative bg-muted">
			<TopNav />
			<Suspense fallback={<ProductDetailsWrapperSkeleton />}>
				<ProductDetailsWrapper params={props.params} />
			</Suspense>
		</main>
	)
}
