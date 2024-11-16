import { Header } from "@/app/_components/header"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { getCategoriesUseCase } from "@/use-cases/categories"
import { getApprovedFarmersUseCase } from "@/use-cases/farmers"
import { Suspense } from "react"
import { EditUserSkeleton } from "../../users/[id]/edit/_components/edit-user-skeleton"
import { CreateProductForm } from "./_components/create-product-form"

const getCategories = async () => {
	return await getCategoriesUseCase()
}
const getApprovedFarmers = async () => {
	return await getApprovedFarmersUseCase()
}
export default async function AdminCreateProductPage() {
	const categoriesPromise = getCategories()
	const approvedFarmersPromise = getApprovedFarmers()
	return (
		<>
			<Header />
			<div className="space-y-2 p-2 lg:space-y-4 lg:p-5">
				<Card className="">
					<CardHeader className="p-4 lg:p-6">
						<CardTitle>Add New Product</CardTitle>
						<CardDescription>
							Enter the details of the product and assign it to a farmer.
						</CardDescription>
					</CardHeader>
					<CardContent className="p-4 pt-0 lg:p-6 lg:pt-0">
						<Suspense fallback={<EditUserSkeleton />}>
							<CreateProductForm
								approvedFarmersPromise={approvedFarmersPromise}
								categoriesPromise={categoriesPromise}
							/>
						</Suspense>
					</CardContent>
				</Card>
			</div>
		</>
	)
}
