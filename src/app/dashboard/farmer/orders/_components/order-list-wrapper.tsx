import { type SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { FarmerOrderList } from "./mobile-order-list"
import { OrderItemSkeleton } from "./order-skeleton"
import { searchParamsCache } from "./searchParams"

type FarmerOrderListProps = {
	searchParams: Promise<SearchParams>
}

export async function OrderListWrapper({ searchParams }: FarmerOrderListProps) {
	await searchParamsCache.parse(searchParams)

	return (
		<Suspense
			fallback={
				<div className="space-y-2">
					<OrderItemSkeleton />
					<OrderItemSkeleton />
					<OrderItemSkeleton />
				</div>
			}
			key={searchParamsCache.get("search")}
		>
			<FarmerOrderList />
		</Suspense>
	)
}
