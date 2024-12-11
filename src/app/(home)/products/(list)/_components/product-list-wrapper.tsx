import { type SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { searchParamsCache } from "../searchParams"
import { ProductList } from "./product-list"

export async function ProductListWrapper({
	searchParams
}: {
	searchParams: Promise<SearchParams>
}) {
	await searchParamsCache.parse(searchParams)

	return (
		<Suspense
			fallback={<div>Loading...</div>}
			key={searchParamsCache.get("search")}
		>
			<ProductList />
		</Suspense>
	)
}
