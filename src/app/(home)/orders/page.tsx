import { ScrollArea } from "@/components/ui/scroll-area"
import { type SearchParams } from "nuqs/server"
import { BottomNav } from "../_components"
import { FilterProducts } from "./_components/filter-products"
import { OrdersNavLinks } from "./_components/nav-links"
import { OrderListWrapper } from "./_components/order-list-wrapper"
import { StatusTabs } from "./_components/tab-list"

type PageProps = {
	searchParams: Promise<SearchParams>
}

export const experimental_ppr = true

export default function OrdersPage({ searchParams }: PageProps) {
	return (
		<main className="w-full bg-muted">
			<header className="w-full bg-background py-4 pb-0 md:hidden">
				<div className="flex w-full items-center justify-between px-4">
					<h1 className="text-2xl font-semibold">Orders</h1>
					<OrdersNavLinks />
				</div>

				<FilterProducts />
				<StatusTabs />
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
