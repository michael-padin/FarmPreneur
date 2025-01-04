import { getOrder } from "@/data-access/orders"
import { OrderDetails } from "./order-details"

type Params = Promise<{ id: string }>
export const experimental_ppr = true

export async function OrderDetailsWrapper({ params }: { params: Params }) {
	const orderId = (await params).id
	const order = await getOrder(orderId)

	return <OrderDetails order={order} />
}
