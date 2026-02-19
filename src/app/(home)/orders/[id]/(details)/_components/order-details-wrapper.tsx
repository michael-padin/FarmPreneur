import { getOrder } from "@/data-access/orders"
import { OrderDetails } from "./order-details"
import OrderDetailsBottomNav from "./order-details-bottom-nav"

type Params = Promise<{ id: string }>
//export const experimental_ppr = true

export async function OrderDetailsWrapper({ params }: { params: Params }) {
	const orderId = (await params).id
	const order = await getOrder(orderId)

	if (!order) return <p>No order found</p>

	return (
		<>
			{order.status === "COMPLETED" && (
				<h2 className="mb-2 text-center text-2xl font-semibold text-primary">
					Order Completed
				</h2>
			)}
			<OrderDetails order={order} />
			<OrderDetailsBottomNav order={order} />
		</>
	)
}
