import { CreateProductSkeleton } from "@/app/dashboard/farmer/products/create/_components/create-product-skeleton"
import { FPBackButton } from "@/components/fp/fp-back-button"
import { Suspense } from "react"
import { CustomerNewAddressForm } from "./_components/new-address-form"

export const experimental_ppr = true
export default function NewAddressPage() {
	return (
		<div className="h-screen">
			<header className="fixed left-0 right-0 top-0 z-50 w-full border-b bg-background pb-0 shadow-sm">
				<div className="flex w-full items-center gap-2 px-4 py-4">
					<FPBackButton />
					<h1 className="text-xl font-semibold">Add New Address</h1>
				</div>
			</header>

			<main>
				<div className="w-full space-y-4 px-4 lg:px-5">
					<div className="pb-4 pt-20">
						<Suspense fallback={<CreateProductSkeleton />}>
							<CustomerNewAddressForm />
						</Suspense>
					</div>
				</div>
			</main>
		</div>
	)
}
