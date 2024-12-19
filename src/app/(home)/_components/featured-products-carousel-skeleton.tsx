import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from "@/components/ui/carousel"
import { ProductCardSkeleton } from "./product-card-skeleton"

export function FeaturedProductsCarouselSkeleton() {
	return (
		<Carousel
			opts={{
				align: "start"
			}}
			className=""
		>
			<CarouselContent className="">
				{[...Array(5)].map((_, index) => (
					<CarouselItem
						key={index}
						className="basis-[45%] pl-2 first:ml-2 md:basis-1/3 lg:basis-1/4 lg:pl-4 lg:first:ml-0 xl:basis-1/5"
					>
						<ProductCardSkeleton />
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious className="hidden h-14 w-14 max-2xl:-left-3 max-xl:-left-4 lg:flex" />
			<CarouselNext className="hidden h-14 w-14 max-2xl:-right-3 max-xl:-right-4 lg:flex" />
		</Carousel>
	)
}
