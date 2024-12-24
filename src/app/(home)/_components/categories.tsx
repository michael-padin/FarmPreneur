import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from "@/components/ui/carousel"
import { getCategories } from "@/data-access/categories"
import Link from "next/link"
import { CategoryCard } from "./category-card"

export default async function Categories() {
	const categories = await getCategories()

	return (
		<>
			{categories.length > 0 ? (
				<Carousel
					opts={{
						align: "start"
					}}
					className=""
				>
					<CarouselContent className="">
						{categories.map((category, index) => (
							<CarouselItem
								key={index}
								className="basis-[30%] pl-2 first:ml-2 md:basis-1/2 lg:basis-1/5 lg:pl-4 lg:first:ml-0"
							>
								<Link
									key={category.id}
									className="inline-block h-full w-full"
									href={`/products?search=${category.name}`}
								>
									<CategoryCard
										description={category.description || ""}
										imageUrl={category.image || "/placeholder.svg"}
										title={category.name}
									/>
								</Link>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious className="hidden h-14 w-14 max-2xl:-left-3 max-xl:-left-4 lg:flex" />
					<CarouselNext className="hidden h-14 w-14 max-2xl:-right-3 max-xl:-right-4 lg:flex" />
				</Carousel>
			) : (
				<div className="h-28">
					<h2 className="m-auto text-center text-lg font-semibold text-muted-foreground">
						No categories found
					</h2>
				</div>
			)}
		</>
	)
}
