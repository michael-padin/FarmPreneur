import Image from "next/image"
import { Star, ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import React from "react"
import {
	getTopProductsUseCase,
	getTopSellingProductsUseCase
} from "@/use-cases/products"

const products = [
	{
		id: 1,
		name: "JISULIFE Handheld Fan Pro1 Mini Fan Rechargeable",
		image: "/placeholder.svg?height=200&width=200",
		rating: 4.9,
		reviews: "18.2K",
		monthlySales: 18217,
		price: 2299,
		discount: 43,
		rank: 1
	},
	{
		id: 2,
		name: "T10 Portable Mini Fan USB Rechargeable Turbo Fan",
		image: "/placeholder.svg?height=200&width=200",
		rating: 4.6,
		reviews: "1.4K",
		monthlySales: 16210,
		price: 63,
		discount: 57,
		rank: 2
	},
	{
		id: 3,
		name: "T10 Portable Turbo Mini Fan USB Rechargeable",
		image: "/placeholder.svg?height=200&width=200",
		rating: 4.6,
		reviews: "3.6K",
		monthlySales: 14632,
		price: 63,
		discount: 77,
		rank: 3
	},
	{
		id: 4,
		name: "Rechargeable Folding Fan N15 N221 T100 Fruit USB",
		image: "/placeholder.svg?height=200&width=200",
		rating: 4.5,
		reviews: "4.7K",
		monthlySales: 11087,
		price: 60,
		discount: 54,
		rank: 4
	}
]

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
