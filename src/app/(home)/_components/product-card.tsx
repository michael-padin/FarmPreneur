import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"
import Image from "next/image"

const formatPrice = (price: number, unit: string) => {
	return (
		<>
			<span className="text-xs">₱</span>
			{`${price.toFixed(2)}/${unit}`}
		</>
	)
}

interface ProductCardProps {
	image: string
	price: number
	farmer: string
	unit: string
	title: string
	averageRating: number
	reviews: number
	description: string
	className?: string
}

export default function ProductCard({
	title,
	image,
	price,
	reviews,
	farmer,
	averageRating,
	unit,
	description,
	className
}: ProductCardProps) {
	return (
		<Card className={`${cn("overflow-hidden", className)}`}>
			<CardContent className="group p-0">
				<div className="relative aspect-square overflow-hidden">
					<Image
						className="object-cover"
						src={image || `/placeholder.svg`}
						alt={title}
						fill
						priority
						sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
					/>
				</div>
				<div className="overflow-hidden p-2">
					<p className="tex-sm w-full truncate underline-offset-2 transition duration-300 ease-in-out group-hover:underline lg:text-base">
						{title}
					</p>
					<div className="mb-1 flex items-center gap-2">
						<div className="flex items-center">
							<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
							<span className="ml-1 text-sm font-medium">{averageRating}</span>
						</div>
						<Separator orientation="vertical" className="h-4 w-px" />
						<span className="text-sm text-muted-foreground">
							{reviews} Reviews
						</span>
					</div>
					<div className="mt-2 flex items-center justify-between">
						<p className="text-sm font-semibold text-primary lg:text-base">
							{formatPrice(price, unit)}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
