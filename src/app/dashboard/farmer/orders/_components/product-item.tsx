import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface Product {
	id: string
	name: string
	image: string
	price: number
	unit: string
	status: string
}

export function ProductItem({ product }: { product: Product }) {
	return (
		<Card className="overflow-hidden">
			<CardContent className="p-0">
				<div className="flex items-center space-x-4">
					<Image
						src={product.image}
						alt={product.name}
						width={100}
						height={100}
						className="h-24 w-24 object-cover"
					/>
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-medium text-gray-900">
							{product.name}
						</p>
						<p className="text-sm text-gray-500">
							${product.price.toFixed(2)} / {product.unit}
						</p>
					</div>
					<div className="inline-flex items-center px-4 text-base font-semibold text-gray-900">
						{product.status === "reviewing" ? (
							<span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800">
								Reviewing
							</span>
						) : (
							<span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
								Live
							</span>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
