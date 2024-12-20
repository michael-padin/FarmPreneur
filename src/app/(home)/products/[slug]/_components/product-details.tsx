import { FPStarRating } from "@/components/fp/fp-star-rating"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { unitMap } from "@/constants/unit"
import { formatPHP } from "@/lib/utils"
import { getProductBySlugUseCase } from "@/use-cases/products"
import Link from "next/link"
import { AddToCart } from "./add-to-cart"
import { BuyNow } from "./buy-now"
import { QuantitySelector } from "./quantity-selector"

export function ProductDetails({
	product
}: {
	product: Awaited<ReturnType<typeof getProductBySlugUseCase>>
}) {
	return (
		<div className="grid bg-background max-md:p-3">
			<h1 className="text-2xl font-semibold capitalize">{product.title}</h1>
			<Link href="#reviews">
				<div className="mt-1 flex items-center gap-2">
					<div className="flex items-center">
						<FPStarRating rating={product.averageRating} />
						<span className="ml-1 text-sm">
							{product.averageRating.toFixed(1)} ({product.reviews.totalReviews}
							)
						</span>
					</div>
					<Separator orientation="vertical" className="h-4 w-px" />
					<span className="text-sm text-muted-foreground">
						{product.totalSold} Sold
					</span>
				</div>
			</Link>
			<div className="!mt-4 flex items-center justify-between gap-4">
				<div className="h-full w-full rounded-lg bg-primary/10 p-2 text-2xl font-semibold text-primary lg:p-4">
					<span className="font-normal">₱</span>
					{formatPHP(product.price)}/{unitMap[product.unit]}
				</div>
			</div>

			<div className="grid gap-4">
				<div className="mt-4 space-y-4">
					<ProductInfoItem label="Description" value={product.description} />
					<ProductInfoItem
						label="Stock"
						value={`${product.quantity} ${unitMap[product.unit]}`}
					/>

					<QuantitySelector />
				</div>
			</div>
			<div className="hidden gap-4 lg:mt-8 lg:flex">
				<AddToCart product={product}>
					<Button variant={"outline"} size={"lg"}>
						Add To cart
					</Button>
				</AddToCart>
				<BuyNow product={product} className="w-auto" size={"lg"} />
			</div>
		</div>
	)
}

function ProductInfoItem({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<Label className="text-base" htmlFor={label.toLowerCase()}>
				{label}
			</Label>
			<p className="text-muted-foreground" id={label.toLowerCase()}>
				{value}
			</p>
		</div>
	)
}
