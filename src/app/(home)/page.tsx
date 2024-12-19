import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Metadata } from "next"
import { Suspense } from "react"
import BottomNav from "./_components/bottom-nav"
import Categories from "./_components/categories"
import { CategoryCardSkeleton } from "./_components/category-card-skeleton"
import { DailyDiscovery } from "./_components/daily-discovery"
import { Features } from "./_components/features"
import { HomeNav } from "./_components/home-nav"
import { ProductCardSkeleton } from "./_components/product-card-skeleton"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
	? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
	: "http://localhost:3000"
export const experimental_ppr = true

export const metadata: Metadata = {
	title: "Fresh Local Produce Marketplace",
	description:
		"Discover and purchase fresh, locally-grown produce from farmers in your area. Support local agriculture with FarmPreneur.",
	openGraph: {
		type: "website",
		url: baseUrl,
		description:
			"Fresh produce from local farmers, available for pickup. Support your local agriculture with FarmPreneur.",
		siteName: "FarmPreneur",
		images: [
			{
				url: `/image.png`,
				width: 1200,
				height: 630,
				alt: "FarmPreneur - Local Farmers Marketplace"
			}
		]
	}
}

export default function Home() {
	return (
		<>
			<header>
				<HomeNav />
			</header>
			<main className="bg-secondary pb-16">
				<section className="m-auto w-full">
					<div className="container relative mx-auto h-full px-0 lg:px-4 lg:pt-[101px]">
						<div className="flex items-center justify-center bg-primary pb-20 pt-24 lg:rounded-lg lg:py-20">
							<div className="relative space-y-5 px-2 text-center text-white lg:space-y-10">
								<h1 className="text-3xl font-bold leading-normal tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
									Discover Local Farm-Fresh Produce
								</h1>
								<p className="mx-auto max-w-[700px] lg:text-xl">
									Pick up the freshest, highest-quality fruits and vegetables
									directly from local farmers. No delivery, just pure local
									goodness.
								</p>
							</div>
						</div>
					</div>
				</section>
				<div className="mx-2">
					<section className="mx-auto -mt-14 w-full rounded-lg px-0 py-2 lg:container lg:-mt-0 lg:px-4">
						<div className="">
							<div className="relative rounded-md bg-background py-2">
								<h1 className="mb-2 px-2 font-semibold lg:text-2xl">
									Categories
								</h1>

								<div>
									<div className="">
										<ScrollArea className="w-full whitespace-nowrap">
											<ScrollBar
												orientation="horizontal"
												className="invisible"
											/>
											<div className="flex gap-2">
												<Suspense fallback={<CategoryCardSkeleton />}>
													<Categories />
												</Suspense>
											</div>
										</ScrollArea>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className="mx-auto rounded-lg px-0 lg:container lg:px-4">
						<div className="rounded-lg bg-background">
							<div className="relative rounded-md bg-background py-2">
								<h3 className="mb-2 px-2 font-semibold lg:text-2xl">
									Featured Products
								</h3>
								<div>
									<div className="">
										<ScrollArea className="overflow-hidden">
											<div className="flex gap-2">
												<Suspense
													fallback={
														<ProductCardSkeleton
															count={8}
															className="inline-block h-full w-[130px] truncate border-none shadow-none first:pl-2 last:pr-2"
														/>
													}
												>
													<Features />
												</Suspense>
											</div>
											<ScrollBar
												orientation="horizontal"
												className="invisible"
											/>
										</ScrollArea>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className="-mx-2 rounded-lg px-0 py-2 lg:container lg:px-4">
						<div className="rounded-lg p-2">
							<h3 className="mb-2 font-semibold lg:text-2xl">
								Daily Discovery
							</h3>
							<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
								<Suspense
									fallback={
										<>
											<ProductCardSkeleton
												count={8}
												className="border-none shadow-none"
											/>
										</>
									}
								>
									<DailyDiscovery />
								</Suspense>
							</div>
						</div>
					</section>
					<BottomNav />
				</div>
			</main>
		</>
	)
}
