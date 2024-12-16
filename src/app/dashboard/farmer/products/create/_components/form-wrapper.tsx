import { auth } from "@/auth"
import { getFarmerAddressesUseCase } from "@/use-cases/address"
import { getCategoriesUseCase } from "@/use-cases/categories"
import { CreateProductForm } from "./create-product-form"

export async function FormWrapper() {
	const userId = (await auth())?.user.id
	const [addresses, categories] = await Promise.all([
		getFarmerAddressesUseCase(),
		getCategoriesUseCase()
	])

	if (!userId) {
		return <div>Please login</div>
	}

	return <CreateProductForm categoriesPromise={categories} userId={userId} />
}
