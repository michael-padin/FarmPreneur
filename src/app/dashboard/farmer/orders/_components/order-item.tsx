import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UnitKey, UNITS_MAP } from "@/constants/unit"
import { formatPHP } from "@/lib/utils"
import { getFarmerOrdersUseCase } from "@/use-cases/orders"
import { Badge } from "lucide-react"
import Image from "next/image"

interface OrderItemProps {
	order: Awaited<ReturnType<typeof getFarmerOrdersUseCase>>[0]
}

export function OrderItem({ order }: OrderItemProps) {
	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex items-start gap-4">
					<Image
						src={`${order.product.images[0].url || "/placeholder.svg"}`}
						alt={order.product.title}
						width={100}
						height={100}
						className="rounded-lg object-cover"
					/>
					<div className="flex-1 space-y-1">
						<div className="flex items-start justify-between">
							<div>
								<h3 className="font-semibold">{order.product.title}</h3>
								<p className="text-sm text-muted-foreground">
									Order # {order.id.slice(0, 6)}
								</p>
							</div>
							<Badge>Pending</Badge>
						</div>
						<div className="flex items-center justify-between text-sm">
							<span>
								Quantity:{" "}
								{`${order.quantity} /
									${UNITS_MAP[(order.product.unit || "kg") as UnitKey].abbreviation}`}
							</span>
							<span className="font-semibold">
								{formatPHP(order.product.price)}
							</span>
						</div>
						<div className="text-sm text-muted-foreground">
							Ordered by: {order.customer?.user.name || "Unknown"}
							<br />
							{/* Delivery Address: 123 Market St, Manila */}
						</div>
						<div className="flex gap-2 pt-2">
							<Button size="sm">Accept Order</Button>
							<Button size="sm" variant="outline">
								Decline
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
