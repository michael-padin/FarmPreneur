import { getDefaultAddressByCustomerId } from "@/use-cases/address"
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
	const [checkoutData, defaultCustomerAddress] = await Promise.all([
		getCheckoutDataUseCase(productId, quantity),
		getDefaultAddressByCustomerId()
	])

	if (!checkoutData.distinctProductsCount) {
		return null
	}

	return (
		<>
			<CartCheckOutList
				checkoutData={checkoutData}
				defaultCustomerAddress={defaultCustomerAddress}
			/>
		</>
	)
}
