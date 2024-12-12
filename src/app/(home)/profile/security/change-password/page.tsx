import { CreateProductSkeleton } from "@/app/dashboard/farmer/products/create/_components/create-product-skeleton"
import { FPBackButton } from "@/components/fp/fp-back-button"
import { Suspense } from "react"
import ChangePasswordForm from "./_components/change-password-form"

export const experimental_ppr = true
export default function ChangePassword() {
	return (
		<div className="h-screen bg-secondary">
			<header className="fixed left-0 right-0 top-0 z-50 w-full bg-background pb-0">
				<div className="flex w-full items-center gap-2 px-4 py-4">
					<FPBackButton />
					<h1 className="text-xl font-semibold">Change Password</h1>
				</div>
			</header>

			<main>
				<div className="w-full space-y-4 px-2 pt-20 lg:px-5">
					<div className="rounded-lg bg-background p-4">
						<Suspense fallback={<CreateProductSkeleton />}>
							<ChangePasswordForm />
						</Suspense>
					</div>
				</div>
			</main>
		</div>
	)
}
