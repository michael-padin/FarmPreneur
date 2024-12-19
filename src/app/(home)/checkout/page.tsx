import { FPBackButton } from "@/components/fp/fp-back-button"
import { Suspense } from "react"
import CartCheckOutListSkeleton from "./_components/checkout-list-skeleton"
import { CheckoutWrapper } from "./_components/checkout-wrapper"

export const experimental_ppr = true

const PickupCheckoutPage = ({
	searchParams
}: {
	searchParams?: Promise<{
		productId?: string
		quantity?: number
	}>
}) => {
	return (
		<div className="flex min-h-screen flex-col bg-secondary">
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="flex h-14 items-center p-2 lg:container">
					<div className="flex flex-1 items-center justify-between">
						<div className="flex items-center gap-2">
							<FPBackButton />
							<h1 className="text-xl font-semibold">Checkout</h1>
						</div>
					</div>
				</div>
			</header>
			<Suspense fallback={<CartCheckOutListSkeleton />}>
				<CheckoutWrapper searchParams={searchParams} />
			</Suspense>
		</div>
	)
}

export default PickupCheckoutPage
