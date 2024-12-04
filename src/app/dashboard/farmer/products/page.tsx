import { type SearchParams } from "nuqs/server"
import { BottomNav } from "../_components/bottom-navigation"
import { StatusTabs } from "./_components/tab-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FilterProducts } from "./_components/filter-products"
import { FarmerProductListWrapper } from "./_components/product-list-wrapper"

type PageProps = {
	searchParams: Promise<SearchParams>
}

export const experimental_ppr = true

export default function ProductsPage({ searchParams }: PageProps) {
	return (
		<main className="w-full">
			<header className="fixed left-0 right-0 top-0 z-50 w-full bg-background py-4 pb-0 md:hidden">
				<div className="flex w-full items-center justify-between px-4">
					<h1 className="text-2xl font-semibold">Products</h1>
					<div className="flex gap-2">
						{/* <MessageCircleMore className="stroke-primary" /> */}
						<Button asChild size="sm">
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
					<FarmerProductListWrapper searchParams={searchParams} />
				</div>
			</div>
			<BottomNav />
		</main>
	)
}
