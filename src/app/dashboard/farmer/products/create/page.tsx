import { FPBackButton } from "@/components/fp/fp-back-button"
import { Suspense } from "react"
import { CreateProductSkeleton } from "./_components/create-product-skeleton"
import { FormWrapper } from "./_components/form-wrapper"

export const experimental_ppr = true

export default function CreateProductPage() {
	return (
		<div className="w-full space-y-4 px-4 lg:px-5">
			<header className="fixed left-0 right-0 top-0 z-50 w-full border-b bg-background pb-0 shadow-sm">
				<div className="flex w-full items-center gap-2 px-4 py-4">
					<FPBackButton />
					<h1 className="text-xl font-semibold">Add Product</h1>
				</div>
			</header>
			<div className="pb-4 pt-16">
				<Suspense fallback={<CreateProductSkeleton />}>
					<FormWrapper />
				</Suspense>
			</div>
		</div>
	)
}
