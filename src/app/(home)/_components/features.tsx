"use client"
import { products } from "@/data"
import Link from "next/link"
import ProductCard from "./product-card"
import {
	Carousel,
	CarouselContent,
	CarouselItem
} from "@/components/ui/carousel"

const Features = () => {
	return (
		<section className="container mx-auto rounded-lg px-0 lg:px-4">
			<div className="rounded-lg bg-background p-2 py-4">
				<div className="flex items-center justify-between">
					<h3 className="mb-2 font-semibold text-primary lg:text-2xl">
						Featured Products
					</h3>
					<Link
						href="/products"
						className="text- text-xs leading-normal text-primary underline-offset-2 hover:underline lg:text-base"
					>
						See all
					</Link>
				</div>
				<Carousel
					className="overflow-hidden"
					opts={{
						align: "start",
						dragFree: true
					}}
				>
					<CarouselContent className="-ml-2 flex">
						{[...products, ...products].map((product, index) => (
							<CarouselItem
								key={product.title}
								className="basis-2/5 pl-2 lg:basis-[18%]"
							>
								<ProductCard
									description={product.description}
									key={index}
									images={product.images}
									title={product.title}
									price={product.price}
									farmer={product.farmerDetails}
									unit={product.unit}
									className="border-none shadow-none"
								/>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>
			</div>
		</section>
	)
}

export default Features
