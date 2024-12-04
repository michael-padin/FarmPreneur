import { type SearchParams } from "nuqs/server"
import { searchParamsCache } from "./searchParams"
import { Suspense } from "react"
import { ProductSkeleton } from "./product-skeleton"
import { FarmerProductList } from "./mobile-product-list"

type FarmerOrderListProps = {
	searchParams: Promise<SearchParams>
}

export async function FarmerProductListWrapper({
	searchParams
}: FarmerOrderListProps) {
	await searchParamsCache.parse(searchParams)

	return (
		<Suspense
			fallback={<ProductSkeleton />}
			key={searchParamsCache.get("status") || searchParamsCache.get("search")}
		>
			<FarmerProductList />
		</Suspense>
	)
}
