import { Suspense } from "react"
import ProductDetailsWrapperSkeleton from "./_components/product-details-skeleton"
import { ProductDetailsWrapper } from "./_components/product-details-wrapper"
import { TopNav } from "./_components/top-nav"

export const experimental_ppr = true

type Params = Promise<{ slug: string }>

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
