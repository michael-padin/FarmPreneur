import { getCategoriesUseCase } from "@/use-cases/categories"
import { CreateProductForm } from "./_components/create-product-form"

import { HeaderBackButton } from "@/components/fg/back-button"
import { Suspense } from "react"
import { CreateProductSkeleton } from "./_components/create-product-skeleton"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getFarmerAddressesUseCase } from "@/use-cases/address"

const CreateProductPage = async () => {
	const categoriesPromise = getCategoriesUseCase()
	const session = await auth()
	if (!session || !session.user) {
		return redirect("/login")
	}
	const addressesPromise = getFarmerAddressesUseCase(session.user.id)

	return (
		<div className="w-full space-y-4 px-4 lg:px-5">
			<header className="fixed left-0 right-0 top-0 z-50 w-full border-b bg-background pb-0 shadow-sm">
				<div className="flex w-full items-center gap-2 px-4 py-4">
					<HeaderBackButton />
					<h1 className="text-xl font-semibold">Add Product</h1>
				</div>
			</header>
			<div className="pb-4 pt-16">
				<Suspense fallback={<CreateProductSkeleton />}>
					<CreateProductForm
						addressesPromise={addressesPromise}
						categoriesPromise={categoriesPromise}
						userId={session.user.id}
					/>
				</Suspense>
			</div>
		</div>
	)
}

export default CreateProductPage
