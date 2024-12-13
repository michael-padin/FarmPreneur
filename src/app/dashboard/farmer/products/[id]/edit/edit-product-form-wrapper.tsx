import { getCategoriesUseCase } from "@/use-cases/categories"
import { getProductByIdFromFarmerUseCase } from "@/use-cases/products"
import { EditProductForm } from "./_components/edit-product-form"

type Params = Promise<{ id: string }>
export async function EditProductFormWrapper({ params }: { params: Params }) {
	const id = (await params).id
	const [categories, product] = await Promise.all([
		getCategoriesUseCase(),
		getProductByIdFromFarmerUseCase(id)
	])

	return <EditProductForm categories={categories} product={product} />
}
