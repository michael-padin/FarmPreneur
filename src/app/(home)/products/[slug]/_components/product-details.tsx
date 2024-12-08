import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { UnitKey, UNITS_MAP } from "@/constants/unit"
import { formatPHP } from "@/lib/utils"
import { Star } from "lucide-react"
import { QuantitySelector } from "./quantity-selector"

interface ProductDetailsProps {
	product: {
		price: number
		unit: UnitKey
		averageRating: number
		_count: { orders: number }
		title: string
		description: string
		quantity: number
	}
}

export function ProductDetails({ product }: ProductDetailsProps) {
	return (
		<div className="grid bg-background p-3">
			<div className="flex items-center justify-between gap-4">
				<div className="text-2xl font-semibold text-primary">
					<span className="text-xs">₱</span>
					{formatPHP(product.price)}/{UNITS_MAP[product.unit].abbreviation}
				</div>
				<div className="mb-1 flex items-center gap-2">
					<div className="flex items-center">
						<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
						<span className="ml-1 text-sm font-medium">
							{product.averageRating}
						</span>
					</div>
					<Separator orientation="vertical" className="h-4 w-px" />
					<span className="text-sm text-muted-foreground">
						{product._count.orders} Sold
					</span>
				</div>
			</div>
			<div className="grid">
				<h1 className="text-2xl font-semibold capitalize">{product.title}</h1>
				<Separator className="my-2" />
				<div className="space-y-4">
					<ProductInfoItem label="Description" value={product.description} />
					<ProductInfoItem
						label="Stock"
						value={`${product.quantity} ${UNITS_MAP[product.unit].abbreviation}`}
					/>

					<QuantitySelector />
				</div>
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
