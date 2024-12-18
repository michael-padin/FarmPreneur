import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getTopProductsUseCase } from "@/use-cases/products"
import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React from "react"

export default async function TopFarmProducts() {
	const products = await getTopProductsUseCase()
	return (
		<div className="space-y-4">
			{products.length > 0 ? (
				products.map((product, index) => (
					<React.Fragment key={product.id}>
						<Link href={`/products/${product.id}`} className="group">
							<div className="flex gap-4 transition-all group-hover:scale-105">
								<div className="relative aspect-square h-24 flex-shrink-0">
									<Badge
										className={`absolute -left-2 -top-2 z-10 ${
											index + 1 === 1
												? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
												: "bg-secondary text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground"
										}`}
									>
										TOP {index + 1}
									</Badge>
									<Image
										src={product.image || "/placeholder.svg"}
										alt={product.image || "product image"}
										className="h-full w-full rounded-lg object-cover"
										fill
									/>
								</div>
								<div className="min-w-0 flex-1">
									<h3 className="mb-1 truncate text-sm font-medium group-hover:underline">
										{product.name}
									</h3>
									<div className="mb-1 flex items-center gap-2">
										<div className="flex items-center">
											<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
											<span className="ml-1 text-sm font-medium">
												{product.averageRating}
											</span>
										</div>
										<Separator orientation="vertical" className="h-4 w-px" />
										<span className="text-sm text-muted-foreground">
											{product.numberOfReviews} Reviews
										</span>
									</div>
									<Badge
										variant="secondary"
										className="mb-1 bg-primary/10 text-primary"
									>
										Monthly Sales: {product.monthlySales.toLocaleString()}
									</Badge>
									<div className="mt-2 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<span className="text-lg text-primary">
												<span className="text-xs">₱</span>
												{product.price}/lb
											</span>
											{/* <span className="text-sm text-destructive">
														-{product.discount}%
													</span> */}
										</div>
									</div>
								</div>
							</div>
							{products.length - 1 !== index && <Separator className="my-4" />}
						</Link>
					</React.Fragment>
				))
			) : (
				<p className="my-10 text-center">No products found</p>
			)}
		</div>
	)
}
