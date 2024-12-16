import { AddressSkeleton } from "@/app/(home)/profile/address/components/address-skeleton"
import { FPBackButton } from "@/components/fp/fp-back-button"
import { Suspense } from "react"
import { AddressListWrapper } from "./components/address-list-wrapper"

export const experimental_ppr = true

export default function FarmerAddressesPage() {
	return (
		<div className="h-screen bg-secondary">
			<header className="fixed left-0 right-0 top-0 z-50 w-full bg-background pb-0 shadow-sm">
				<div className="flex w-full items-center gap-2 px-4 py-4">
					<FPBackButton />
					<h1 className="text-xl font-semibold">Address</h1>
				</div>
			</header>
			<main>
				<div className="w-full space-y-2 px-2 lg:px-5">
					<div className="pt-20">
						<Suspense
							fallback={
								<div className="space-y-2">
									<AddressSkeleton count={3} />
								</div>
							}
						>
							<AddressListWrapper />
						</Suspense>
					</div>
				</div>
			</main>
		</div>
	)
}
