import { Suspense } from "react"
import { BackButton } from "./_components/back-button"
import { CheckoutWrapper } from "./_components/checkout-wrapper"

export const experimental_ppr = true

const PickupCheckoutPage = ({
	searchParams
}: {
	searchParams?: Promise<{
		productId?: string
		quantity?: number
		from: "product" | "cart"
	}>
}) => {
	return (
		<div className="flex min-h-screen flex-col bg-secondary">
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="flex h-14 items-center p-2 lg:container">
					<div className="flex flex-1 items-center justify-between">
						<div className="flex items-center gap-2">
							<BackButton />
							<h1 className="text-xl font-semibold">Checkout</h1>
						</div>
					</div>
				</div>
			</header>
			<Suspense fallback={<div>Loading...</div>}>
				<CheckoutWrapper searchParams={searchParams} />
			</Suspense>
		</div>
	)
}

export default PickupCheckoutPage
