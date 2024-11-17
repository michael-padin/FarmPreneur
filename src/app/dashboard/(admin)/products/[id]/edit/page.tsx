import { DashboardHeader } from "@/app/_components/header"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { getCategoriesUseCase } from "@/use-cases/categories"
import { getApprovedFarmersUseCase } from "@/use-cases/farmers"
import { Suspense } from "react"
import { EditUserSkeleton } from "../../../users/[id]/edit/_components/edit-user-skeleton"
import { getProductByIdUseCase } from "@/use-cases/products"
import { AdminEditProductForm } from "./_components/edit-product-form"
import { BackButton, BreadcrumbResponsive } from "@/components/fg/back-button"

const getProduct = async (id: string) => {
	return await getProductByIdUseCase(id)
}

const getCategories = async () => {
	return await getCategoriesUseCase()
}
const getApprovedFarmers = async () => {
	return await getApprovedFarmersUseCase()
}

type Params = Promise<{ id: string }>

export default async function AdminEditProductPage(props: { params: Params }) {
	const params = await props.params
	const productPromise = getProduct(params.id)
	const categoriesPromise = getCategories()
	const approvedFarmersPromise = getApprovedFarmers()
	const breadcrumbItems = [
		{ href: "/dashboard", label: "Dashboard" },
		{ href: "/dashboard/products", label: "Products" },
		{ label: "Edit Product" }
	]
	return (
		<>
			<DashboardHeader />
			<div className="space-y-2 p-2 lg:space-y-4 lg:p-5">
				<BreadcrumbResponsive items={breadcrumbItems} />
				<Card className="mx-auto max-w-screen-md">
					<CardHeader className="p-4 lg:p-6">
						<CardTitle>Edit Product</CardTitle>
						<CardDescription>
							Edit the details of the product and assign it to a farmer.
						</CardDescription>
					</CardHeader>
					<CardContent className="p-4 pt-0 lg:p-6 lg:pt-0">
						<Suspense fallback={<EditUserSkeleton />}>
							<AdminEditProductForm
								approvedFarmersPromise={approvedFarmersPromise}
								categoriesPromise={categoriesPromise}
								productPromise={productPromise}
							/>
						</Suspense>
					</CardContent>
				</Card>
			</div>
		</>
	)
}
