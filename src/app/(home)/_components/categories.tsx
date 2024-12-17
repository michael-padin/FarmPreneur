import { getCategoriesUseCase } from "@/use-cases/categories"
import Link from "next/link"
import { CategoryCard } from "./category-card"

export default async function Categories() {
	const categories = await getCategoriesUseCase()

	return (
		<>
			{categories.length > 0 ? (
				categories.map((category) => (
					<Link
						key={category.id}
						className="inline-block h-full w-full first:pl-2 last:pr-2"
						href={`/products?search=${category.name}`}
					>
						<CategoryCard
							description={category.description || ""}
							imageUrl={category.image || "/placeholder.svg"}
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
		</>
	)
}
