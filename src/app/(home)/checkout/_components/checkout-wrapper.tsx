import { getCheckoutDataUseCase } from "@/use-cases/customers"
import CartCheckOutList from "./checkout-list"

export async function CheckoutWrapper({
	searchParams
}: {
	searchParams?: Promise<{
		productId?: string
		quantity?: number
	}>
}) {
	const params = await searchParams

	const productId = params?.productId
	const quantity = params?.quantity
	const checkoutData = await getCheckoutDataUseCase(productId, quantity)

	if (!checkoutData.distinctProductsCount) {
		return null
	}

	return <CartCheckOutList checkoutData={checkoutData} />
}
