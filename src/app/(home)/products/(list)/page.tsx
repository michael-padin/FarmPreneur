import { FPBackButton } from "@/components/fp/fp-back-button"
import { Metadata } from "next"
import { type SearchParams } from "nuqs/server"
import { FilterProducts } from "./_components/filter-products"
import { ProductListWrapper } from "./_components/product-list-wrapper"
import { SortTabs } from "./_components/tab-list"
import { TopNav } from "./_components/top-nav"

export const experimental_ppr = true

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
	? process.env.NEXT_PUBLIC_BASE_URL
	: "http://localhost:3000"

export const metadata: Metadata = {
	title: "Products",
	description: "Buy fresh produce from local farmers.",
	alternates: {
		canonical: `${baseUrl}/products`
	}
}

export default function ProductListPage({
	searchParams
}: {
	searchParams: Promise<SearchParams>
}) {
	return (
		<>
			<header className="fixed top-0 z-10 w-full space-y-3 overflow-auto bg-background px-3 pt-3">
				<div className="lg:container">
					<div className="flex w-full items-center justify-between">
						<div className="flex items-center gap-2">
							<FPBackButton />
							<div className="">
								<h2 className={`text-xs font-bold ${"text-primary"}`}>
									FarmPreneur
								</h2>
								<h1 className="text-2xl font-semibold">Products</h1>
							</div>
						</div>
						<TopNav />
					</div>
					<FilterProducts />
					<SortTabs />
				</div>
			</header>
			<main className="h-screen overflow-auto bg-secondary lg:container">
				<div className="p-2 pb-3 pt-[164px]">
					<ProductListWrapper searchParams={searchParams} />
				</div>
			</main>
		</>
	)
}
