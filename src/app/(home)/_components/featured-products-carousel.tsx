"use client"
import Autoplay from "embla-carousel-autoplay"

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from "@/components/ui/carousel"
import { getDailyProductsUseCase } from "@/use-cases/products"
import Link from "next/link"
import ProductCard from "./product-card"
export function FeaturedProductsCarousel({
	products
}: {
	products: Awaited<ReturnType<typeof getDailyProductsUseCase>>
}) {
	return (
		<Carousel
			opts={{
				align: "start"
			}}
			plugins={[
				Autoplay({
					delay: 2000
				})
			]}
			className=""
		>
			<CarouselContent className="">
				{products.map((product, index) => (
					<CarouselItem
						key={index}
						className="basis-[45%] pl-2 first:ml-2 md:basis-1/3 lg:basis-1/4 lg:pl-4 lg:first:ml-0 xl:basis-1/5"
					>
						<Link key={index} className="" href={`/products/${product.slug}`}>
							<ProductCard
								sold={product.totalSold}
								description={product.description}
								image={product.productImages[0] || "/placeholder.svg"}
								title={product.title}
								averageRating={product.averageRating}
								reviews={product._count.reviews}
								price={product.price}
								farmer={product.farmer?.user.name || ""}
								unit={product.unit || "kg"}
								className=""
							/>
						</Link>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious className="hidden h-14 w-14 max-2xl:-left-3 max-xl:-left-4 lg:flex" />
			<CarouselNext className="hidden h-14 w-14 max-2xl:-right-3 max-xl:-right-4 lg:flex" />
		</Carousel>
	)
}
