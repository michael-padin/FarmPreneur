import { Card, CardContent } from "@/components/ui/card"
import {
	Carousel,
	CarouselContent,
	CarouselItem
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCategoryCard() {
	return (
		<Card className="group border-none">
			<CardContent className="h-32 w-full p-0 lg:w-full">
				<div className="relative h-20 overflow-hidden rounded-lg lg:h-32">
					<Skeleton className="h-full w-full" />
				</div>
				<div className="px-1 pt-2">
					<Skeleton className="h-4 w-3/4" />
				</div>
			</CardContent>
		</Card>
	)
}

export function CategoriesSkeleton() {
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
						className="basis-[30%] pl-2 first:ml-2 md:basis-1/2 lg:basis-1/5 lg:pl-4 lg:first:ml-0"
					>
						<SkeletonCategoryCard />
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	)
}
