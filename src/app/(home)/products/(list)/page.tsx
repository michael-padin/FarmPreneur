import { type SearchParams } from "nuqs/server"
import { BackButton } from "./_components/back-button"
import { FilterProducts } from "./_components/filter-products"
import { ProductListWrapper } from "./_components/product-list-wrapper"
import { SortTabs } from "./_components/tab-list"
import { TopNav } from "./_components/top-nav"

export const experimental_ppr = true

export default function ProductListPage({
	searchParams
}: {
	searchParams: Promise<SearchParams>
}) {
	return (
		<>
			<header className="sticky top-0 z-10 w-full space-y-3 bg-background px-3 pt-3">
				<div className="flex w-full items-center justify-between">
					<div className="flex items-center gap-2">
						<BackButton />
						<h1 className="text-2xl font-semibold">Products</h1>
					</div>
					<TopNav />
				</div>
				<FilterProducts />
				<SortTabs />
			</header>
			<main className="h-full bg-secondary">
				<div className="p-2 pt-3">
					<ProductListWrapper searchParams={searchParams} />
				</div>
			</main>
		</>
	)
}
