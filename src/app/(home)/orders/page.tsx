import { ScrollArea } from "@/components/ui/scroll-area"
import { type SearchParams } from "nuqs/server"
import { Suspense } from "react"
import BottomNav from "../_components/bottom-nav"
import { FilterProducts } from "./_components/filter-products"
import { OrdersNavLinks } from "./_components/nav-links"
import { OrderListWrapper } from "./_components/order-list-wrapper"
import { StatusTabsWrapper } from "./_components/status-tab-wrapper"
import StatusTabsSkeleton from "./_components/status-tabs-skeleton"

type PageProps = {
	searchParams: Promise<SearchParams>
}

//export const experimental_ppr = true

export default function OrdersPage({ searchParams }: PageProps) {
	return (
		<main className="w-full bg-muted">
			<header className="w-full bg-background py-4 pb-0 md:hidden">
				<div className="flex w-full items-center justify-between px-4">
					<div className="">
						<h2 className={`text-xs font-bold ${"text-primary"}`}>
							FarmPreneur
						</h2>
						<h1 className="text-2xl font-bold">Orders</h1>
					</div>
					<OrdersNavLinks />
				</div>

				<FilterProducts />
				<Suspense fallback={<StatusTabsSkeleton />}>
					<StatusTabsWrapper />
				</Suspense>
			</header>

			<ScrollArea className="h-[calc(100vh-160px)]">
				<div className="px-2 pb-[84px] pt-2">
					<OrderListWrapper searchParams={searchParams} />
				</div>
			</ScrollArea>
			<BottomNav />
		</main>
	)
}
