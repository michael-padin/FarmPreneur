import Image from "next/image"
import {
	MoreVertical,
	Eye,
	Pencil,
	Trash2,
	Box,
	ShoppingCart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { searchParamsCache } from "./searchParams"
import { formatDate } from "@/lib/utils"
import { ProductListingStatusBadge } from "@/app/dashboard/(admin)/users/(lists)/_components/badges"
import { UnitKey, UNITS_MAP } from "@/constants/unit"
import { getFarmerOrdersUseCase } from "@/use-cases/orders"
import { OrderItem } from "./order-item"

export async function FarmerOrderList() {
	const { status, search } = searchParamsCache.all()
	const orders = await getFarmerOrdersUseCase({
		status,
		search
	})

	return (
		<div className="space-y-4">
			{orders && orders.length > 0 ? (
				orders?.map((order) => <OrderItem order={order} key={order.id} />)
			) : (
				<div className="pt-20">
					<div className="flex h-full flex-col items-center justify-center text-muted-foreground">
						<div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
							<ShoppingCart className="h-8 w-8" />
						</div>
						<p className="text-sm">No orders yet</p>
					</div>
				</div>
			)}
		</div>
	)
}
