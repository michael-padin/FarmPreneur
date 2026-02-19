import { auth } from "@/auth"
import { getCustomerUnReviewedOrderUseCase } from "@/use-cases/orders"
import { RateForm } from "./rate-form"

type Params = Promise<{ id: string }>
//export const experimental_ppr = true
export async function RateFormWrapper({ params }: { params: Params }) {
	const id = (await params).id
	const userId = (await auth())?.user.id || ""
	const order = await getCustomerUnReviewedOrderUseCase({
		orderId: id
	})

	if (!order) {
		return <div>No order found</div>
	}

	return <RateForm order={order} orderId={id} userId={userId} />
}
