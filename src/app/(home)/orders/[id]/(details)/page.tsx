import { FPBackButton } from "@/components/fp/fp-back-button"
import { Loader2 } from "lucide-react"
import { Suspense } from "react"
import { OrderDetailsWrapper } from "./_components/order-details-wrapper"

type Params = Promise<{ id: string }>

//export const experimental_ppr = true
export default function OrderDetailsPage({ params }: { params: Params }) {
	return (
		<div className="overflow-auto bg-secondary">
			<header className="fixed left-0 right-0 top-0 z-50 w-full bg-background pb-0 shadow-sm">
				<div className="flex w-full items-center gap-3 px-3 py-4">
					<FPBackButton className="" />
					<h1 className="text-xl font-semibold">Order Details</h1>
				</div>
			</header>
			<main>
				<div className="w-full space-y-2 px-2 lg:px-5">
					<div className="">
						<div className="">
							<div className="pb-20 pt-20">
								<Suspense
									fallback={
										<div className="flex h-screen items-center justify-center">
											<Loader2 className="h-5 w-5 animate-spin text-primary" />
										</div>
									}
								>
									<OrderDetailsWrapper params={params} />
								</Suspense>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}
