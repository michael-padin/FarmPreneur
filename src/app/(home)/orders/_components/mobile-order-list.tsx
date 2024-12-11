import { getCustomerOrdersUseCase } from "@/use-cases/orders"
import { Box } from "lucide-react"
import Order from "./order"
import { searchParamsCache } from "./searchParams"

export async function CustomerOrderList() {
	const { status, search } = searchParamsCache.all()

	const orders = await getCustomerOrdersUseCase({
		status,
		search
	})

	return (
		<div className="space-y-2">
			{orders && orders.length > 0 ? (
				orders?.map((order) => <Order order={order} key={order.id} />)
			) : (
				<div className="pt-20">
					<div className="flex h-full flex-col items-center justify-center text-muted-foreground">
						<div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-background">
							<Box className="h-8 w-8 text-primary" />
						</div>
						<p className="text-sm">No orders yet</p>
					</div>
				</div>
			)}
		</div>
	)
}
