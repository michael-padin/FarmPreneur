import { getCustomerUnReviewedOrderUseCase } from "@/use-cases/orders"
import { RateForm } from "./rate-form"

type Params = Promise<{ id: string }>
export const experimental_ppr = true
export async function RateFormWrapper({ params }: { params: Params }) {
	const id = (await params).id
	const orderItems = await getCustomerUnReviewedOrderUseCase({
		orderId: id
	})

	if (!orderItems.length) {
		return <div>No items in order</div>
	}

	return <RateForm orderItems={orderItems} orderId={id} />
}
