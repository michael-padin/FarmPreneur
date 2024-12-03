import { BottomNav } from "../_components/bottom-navigation"
import { StatusTabs } from "./_components/tab-list"
import { FarmerOrderList } from "./_components/mobile-order-list"
import { searchParamsCache } from "./_components/searchParams"
import { type SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { OrderItemSkeleton } from "./_components/order-skeleton"
import { FilterProducts } from "./_components/filter-products"
import { MessageCircleMore } from "lucide-react"

type PageProps = {
	searchParams: Promise<SearchParams>
}

export default async function OrdersPage({ searchParams }: PageProps) {
	await searchParamsCache.parse(searchParams)

	return (
		<main className="w-full">
			<header className="fixed left-0 right-0 top-0 z-50 w-full bg-background py-4 pb-0 md:hidden">
				<div className="flex w-full items-center justify-between px-4">
					<h1 className="text-2xl font-semibold">Orders</h1>
					<div className="flex gap-2">
						<MessageCircleMore className="stroke-primary" />
					</div>
				</div>

				<FilterProducts />
				<StatusTabs />
			</header>

			<div className="pb-24 pt-44">
				<div className="px-4">
					<Suspense
						fallback={
							<div className="space-y-4">
								<OrderItemSkeleton />
								<OrderItemSkeleton />
								<OrderItemSkeleton />
							</div>
						}
						key={
							searchParamsCache.get("status") || searchParamsCache.get("search")
						}
					>
						<FarmerOrderList searchParams={searchParams} />
					</Suspense>
				</div>
			</div>
			<BottomNav />
		</main>
	)
}
