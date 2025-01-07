import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { type SearchParams } from "nuqs/server"
import { BottomNav } from "../_components/bottom-navigation"
import { FilterProducts } from "./_components/filter-products"
import { FarmerProductListWrapper } from "./_components/product-list-wrapper"
import { ProductsNavLink } from "./_components/products-nav-link"
import { StatusTabs } from "./_components/tab-list"

type PageProps = {
	searchParams: Promise<SearchParams>
}

export const experimental_ppr = true

export default function ProductsPage({ searchParams }: PageProps) {
	return (
		<>
			<div className="w-full bg-muted">
				{/* <header className="fixed left-0 right-0 top-0 z-50 w-full bg-background py-4 pb-0 md:hidden"> */}
				<header className="w-full bg-background py-4 pb-0 md:hidden">
					<div className="flex w-full items-center justify-between px-4">
						<div className="">
							<h2 className={`text-xs font-bold ${"text-primary"}`}>
								FarmPreneur
							</h2>
							<h1 className="text-2xl font-bold">Products</h1>
						</div>
						<div className="flex items-center gap-3">
							<Button asChild size="sm">
								<Link
									href={"/dashboard/farmer/products/create"}
									className="flex items-center"
								>
									Add Product
								</Link>
							</Button>
							<ProductsNavLink />
						</div>
					</div>
					<FilterProducts />
					<StatusTabs />
				</header>
				{/* <div className="pb-[84px] pt-[164px]">  */}
				<ScrollArea className="h-[calc(100vh-164px)]">
					<div className="px-2 pb-[84px] pt-2">
						<FarmerProductListWrapper searchParams={searchParams} />
					</div>
				</ScrollArea>
			</div>
			<BottomNav />
		</>
	)
}
