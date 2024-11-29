import { BottomNav } from "../_components/bottom-navigation"
import { StatusTabs } from "./_components/tab-list"
import { FarmerProductList } from "./_components/mobile-product-list"
import { Button } from "@/components/ui/button"
import { searchParamsCache } from "./_components/searchParams"
import { type SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { ProductSkeleton } from "./_components/product-skeleton"
import Link from "next/link"
import { FilterProducts } from "./_components/filter-products"

type PageProps = {
	searchParams: Promise<SearchParams>
}

export default async function ProductsPage({ searchParams }: PageProps) {
	await searchParamsCache.parse(searchParams)

	return (
		<main className="w-full">
			<header className="fixed left-0 right-0 top-0 z-50 w-full bg-background py-4 pb-0 md:hidden">
				<div className="flex w-full items-center justify-between px-4">
					<h1 className="text-xl font-medium">Products</h1>
					<div className="flex gap-2">
						{/* <MessageCircleMore className="stroke-primary" /> */}
						<Button asChild>
							<Link
								href={"/dashboard/farmer/products/create"}
								className="flex items-center"
							>
								Add Product
							</Link>
						</Button>
					</div>
				</div>

				<FilterProducts />
				<StatusTabs />
			</header>

			<div className="pb-24 pt-44">
				<div className="px-4">
					<Suspense
						fallback={<ProductSkeleton />}
						key={searchParamsCache.get("status")}
					>
						<FarmerProductList />
					</Suspense>
				</div>
			</div>
			<BottomNav />
		</main>
	)
}
