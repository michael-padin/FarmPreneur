import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { getCategoriesUseCase } from "@/use-cases/categories"
import Link from "next/link"
import { CategoryCard } from "./category-card"

export default async function Categories() {
	const categories = await getCategoriesUseCase()

	return (
		<section className="mx-auto -mt-10 w-full rounded-lg px-0 py-2 lg:container lg:-mt-0 lg:px-4">
			<div className="">
				<div className="relative rounded-md bg-background py-2">
					<h1 className="mb-2 px-2 font-semibold lg:text-2xl">Categories</h1>

					<div>
						<div className="">
							<ScrollArea className="w-full whitespace-nowrap">
								<div className="flex gap-2">
									{categories.length > 0 ? (
										categories.map((category) => (
											<Link
												key={category.id}
												className="inline-block h-full w-full first:pl-2 last:pr-2"
												href={`/products/categories/${category.slug}`}
											>
												<CategoryCard
													description={category.description || ""}
													imageUrl={category.image?.url || "/placeholder.svg"}
													title={category.name}
												/>
											</Link>
										))
									) : (
										<div className="h-28">
											<h2 className="m-auto text-center text-lg font-semibold text-muted-foreground">
												No categories found
											</h2>
										</div>
									)}
								</div>
								<ScrollBar orientation="horizontal" className="invisible" />
							</ScrollArea>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
