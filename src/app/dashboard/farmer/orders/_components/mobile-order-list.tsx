import { ShoppingCart } from "lucide-react"
import { searchParamsCache } from "./searchParams"
import { getFarmerOrdersUseCase } from "@/use-cases/orders"
import { OrderItem } from "./order-item"
import { SearchParams } from "nuqs"

type FarmerOrderListProps = {
	searchParams: Promise<SearchParams>
}

export const experimental_ppr = true

export async function FarmerOrderList({ searchParams }: FarmerOrderListProps) {
	await searchParamsCache.parse(searchParams)
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
