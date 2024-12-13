import { FPBackButton } from "@/components/fp/fp-back-button"
import { Suspense } from "react"
import { EditProductSkeleton } from "./_components/edit-product-skeleton"
import { EditProductFormWrapper } from "./edit-product-form-wrapper"

type Params = Promise<{ id: string }>
export const experimental_ppr = true

export default function EditProductPage({ params }: { params: Params }) {
	return (
		<div className="h-screen overflow-auto bg-secondary">
			<header className="fixed left-0 right-0 top-0 z-50 w-full bg-background pb-0 shadow-sm">
				<div className="flex w-full items-center gap-2 px-4 py-4">
					<FPBackButton />
					<h1 className="text-xl font-semibold">Update Product</h1>
				</div>
			</header>
			<main className="">
				<div className="w-full space-y-2 px-2 lg:px-5">
					<div className="pb-20 pt-20">
						<Suspense fallback={<EditProductSkeleton />}>
							<EditProductFormWrapper params={params} />
						</Suspense>
					</div>
				</div>
			</main>
		</div>
	)
}
