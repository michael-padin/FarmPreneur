import { Package, ShoppingCart, Star, PhilippinePeso } from "lucide-react"
import { cn } from "@/lib/utils"

interface FarmerMetricCardProps {
	title: string
	value: string
	subValue?: string
	variant: "products" | "revenue" | "orders" | "rating"
	className?: string
}

export function FarmerMetricCard({
	title,
	value,
	subValue,
	variant,
	className
}: FarmerMetricCardProps) {
	const icons = {
		products: Package,
		revenue: PhilippinePeso,
		orders: ShoppingCart,
		rating: Star
	}

	const Icon = icons[variant]

	const gradients = {
		products: "bg-gradient-to-br from-green-600 to-green-500", // Representing crops and growth
		revenue: "bg-gradient-to-br from-sky-500 to-blue-400", // Representing wheat and harvest
		orders: "bg-gradient-to-br from-amber-600 to-amber-700", // Representing soil and earth
		rating: "bg-gradient-to-br from-amber-500 to-yellow-400" // Representing clear skies rating
	}

	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-lg p-4 text-white",
				gradients[variant],
				className
			)}
		>
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-2">
					{/* <Icon className="h-4 w-4" /> */}
					<h3 className="text-sm font-medium text-white">{title}</h3>
				</div>
				<p className="text-2xl font-semibold">{value}</p>
				{subValue && <p className="text-sm text-white">{subValue}</p>}
			</div>
			<div
				className="absolute bottom-0 right-0 h-32 w-32 translate-x-8 translate-y-8 rounded-full border border-white/10 bg-white/10"
				aria-hidden="true"
			/>
			<div className="absolute bottom-2 right-2">
				<Icon className="h-16 w-16 text-white/20" />
			</div>
		</div>
	)
}
