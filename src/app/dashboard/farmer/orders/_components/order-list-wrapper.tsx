import { type SearchParams } from "nuqs/server"
import { searchParamsCache } from "./searchParams"
import { FarmerOrderList } from "./mobile-order-list"
import { Suspense } from "react"
import { OrderItemSkeleton } from "./order-skeleton"

type FarmerOrderListProps = {
	searchParams: Promise<SearchParams>
}

export async function OrderListWrapper({ searchParams }: FarmerOrderListProps) {
	await searchParamsCache.parse(searchParams)

	return (
		<Suspense
			fallback={
				<div className="space-y-4">
					<OrderItemSkeleton />
					<OrderItemSkeleton />
					<OrderItemSkeleton />
				</div>
			}
			key={searchParamsCache.get("status") || searchParamsCache.get("search")}
		>
			<FarmerOrderList />
		</Suspense>
	)
}
