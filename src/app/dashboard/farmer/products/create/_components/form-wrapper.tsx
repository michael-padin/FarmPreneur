import { getFarmerAddressesUseCase } from "@/use-cases/address"
import { getCategoriesUseCase } from "@/use-cases/categories"
import { CreateProductForm } from "./create-product-form"

export async function FormWrapper() {
	const [addresses, categories] = await Promise.all([
		getFarmerAddressesUseCase(),
		getCategoriesUseCase()
	])

	return (
		<CreateProductForm
			addressesPromise={addresses}
			categoriesPromise={categories}
		/>
	)
}
