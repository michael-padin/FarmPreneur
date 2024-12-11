import { ProductCardSkeleton } from "@/app/(home)/_components/product-card-skeleton"
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
			fallback={
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
					{Array.from({ length: 6 }).map((_, index) => (
						<ProductCardSkeleton
							key={index}
							className="border-none outline-none"
						/>
					))}
				</div>
			}
			key={searchParamsCache.get("search")}
		>
			<ProductList />
		</Suspense>
	)
}
