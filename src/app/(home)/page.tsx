import JsonLd from "@/components/json-ld"
import { PushNotificationManagerWrapper } from "@/components/push-notification-manager-wrapper"
import {
	generateHomeJsonLd,
	generateOrganizationJsonLd
} from "@/lib/structured-data"
import { Suspense } from "react"
import BottomNav from "./_components/bottom-nav"
import Categories from "./_components/categories"
import { CategoriesSkeleton } from "./_components/category-card-skeleton"
import { DailyDiscovery } from "./_components/daily-discovery"
import { FeaturedProducts } from "./_components/featured-products"
import { FeaturedProductsCarouselSkeleton } from "./_components/featured-products-carousel-skeleton"
import { HomeNav } from "./_components/home-nav"
import { LoginSignUpCTA } from "./_components/login-sign-up-cta"
import { ProductCardSkeleton } from "./_components/product-card-skeleton"

export const experimental_ppr = true

export default function Home() {
	const websiteJsonLd = generateHomeJsonLd()
	const organizationJsonLd = generateOrganizationJsonLd()
	return (
		<>
			<PushNotificationManagerWrapper />
			<header>
				<HomeNav />
			</header>
			<main className="bg-background pb-20">
				<JsonLd data={[websiteJsonLd, organizationJsonLd]} />
				<section className="m-auto h-full w-full bg-primary lg:flex lg:h-[70vh] lg:items-center">
					<div className="relative mx-auto h-full px-0 lg:p-0 lg:px-0 lg:pt-0">
						<div className="flex items-center justify-center px-3 pb-20 pt-24 lg:h-full lg:rounded-lg lg:pb-0 lg:pt-0">
							<div className="relative space-y-5 px-2 text-center text-white lg:space-y-10">
								<h1 className="text-3xl font-bold leading-normal tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
									Discover Local Farm-Fresh Produce
								</h1>
								<p className="mx-auto max-w-[700px] lg:text-xl">
									Pick up the freshest, highest-quality fruits and vegetables
									directly from local farmers. No delivery, just pure local
									goodness.
								</p>
								<Suspense fallback={"..."}>
									<LoginSignUpCTA />
								</Suspense>
							</div>
						</div>
					</div>
				</section>
				<div className="mx-2 lg:mx-0 lg:space-y-12">
					<section className="mx-auto rounded-lg px-0 lg:container lg:mt-12 lg:px-4">
						<div className="">
							<div className="relative rounded-md bg-background py-2">
								<h2 className="mb-2 font-semibold lg:text-2xl">Categories</h2>

								<div>
									<div className="">
										<div className="">
											<Suspense fallback={<CategoriesSkeleton />}>
												<Categories />
											</Suspense>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className="mx-auto rounded-lg px-0 lg:container lg:px-4">
						<div className="rounded-lg bg-background">
							<div className="relative rounded-md bg-background py-2">
								<h2 className="mb-2 font-semibold lg:text-2xl">
									Featured Products
								</h2>
								<div>
									<div className="">
										<div className="">
											<Suspense fallback={<FeaturedProductsCarouselSkeleton />}>
												<FeaturedProducts />
											</Suspense>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className="rounded-lg px-0 py-2 lg:container lg:px-4">
						<div className="rounded-lg">
							<h2 className="mb-2 font-semibold lg:text-2xl">
								Daily Discovery
							</h2>
							<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5">
								<Suspense
									fallback={
										<>
											<ProductCardSkeleton count={8} className="" />
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
