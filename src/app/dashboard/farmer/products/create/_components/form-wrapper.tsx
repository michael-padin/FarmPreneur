import { auth } from "@/auth"
import { getCategories } from "@/data-access/categories"
import { CreateProductForm } from "./create-product-form"

export async function FormWrapper() {
	const userId = (await auth())?.user.id
	const categories = await getCategories()

	if (!userId) {
		return <div>Please login</div>
	}

	return <CreateProductForm categories={categories} userId={userId} />
}
