import { db } from "@/lib/db"
import { getProductBySlugUseCase } from "@/use-cases/products"
import { Metadata } from "next"
import { Suspense } from "react"
import ProductSkeleton from "./_components/product-details-skeleton"
import { ProductDetailsWrapper } from "./_components/product-details-wrapper"
import { TopNav } from "./_components/top-nav"

//export const experimental_ppr = true
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
	? process.env.NEXT_PUBLIC_BASE_URL
	: "http://localhost:3000"

export async function generateStaticParams() {
	const products = await db.product.findMany({ select: { id: true } })
	return products.map((product) => ({
		id: String(product.id)
	}))
}

type Params = Promise<{ slug: string }>

export async function generateMetadata({
	params
}: {
	params: Params
}): Promise<Metadata> {
	const slug = (await params).slug
	const product = await getProductBySlugUseCase(slug)
	const title = `${product.title}`
	const description = `Buy fresh ${product.title} from ${product.farmer.name}. ${product.description}`

	return {
		title,
		description,
		alternates: {
			canonical: `${baseUrl}/products/${slug}`
		},
		robots: {
			follow: true,
			index: true
		},
		openGraph: {
			title,
			description,
			type: "website",
			images: [
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
			images: [
				{
					url: product.productImages[0],
					width: 800,
					height: 600,
					alt: product.title
				}
			]
		}
	}
}

export default function Page(props: { params: Params }) {
	return (
		<>
			<header>
				<TopNav />
			</header>
			<main className="relative bg-muted">
				<Suspense fallback={<ProductSkeleton />}>
					<ProductDetailsWrapper params={props.params} />
				</Suspense>
			</main>
		</>
	)
}
