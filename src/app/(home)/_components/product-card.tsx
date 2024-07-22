import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"

const settings: Settings = {
	dots: true,
	infinite: true,
	speed: 500,
	swipe: true,
	slidesToShow: 1,
	slidesToScroll: 1
}

const formatPrice = (price: number, unit: string) => {
	return (
		<>
			<span className="text-xs">₱</span>
			{`${price.toFixed(2)}/${unit}`}
		</>
	)
}

const truncateText = (description: string, maxLength: number) => {
	if (description.length > maxLength) {
		return description.substring(0, maxLength) + "..."
	}
	return description
}

interface ProductCardProps {
	images: string[]
	price: number
	farmer: string
	unit: string
	title: string
	description: string
	className?: string
}

export default function ProductCard({
	images,
	price,
	farmer,
	unit,
	description,
	className
}: ProductCardProps) {
	return (
		<Link href={`${"/products/1"}`}>
			<Card className={`${cn("", className)}`}>
				<CardContent className="p-2">
					<div className="-mx-2 -mt-2">
						<AspectRatio ratio={1 / 1}>
							<img
								className="w-full rounded-md rounded-b-none object-cover"
								src={images[0]}
							/>
						</AspectRatio>
					</div>
					<div className="overflow-hidden pt-2">
						<p className="line-clamp-2 text-xs lg:text-base">{description}</p>
						<div className="mt-2 flex items-center justify-between">
							<p className="text-sm font-semibold text-primary lg:text-base">
								{formatPrice(price, unit)}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	)
}
