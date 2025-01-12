import { DashboardHeader } from "@/app/_components/header"
import { Suspense } from "react"
import { BreadcrumbWrapper } from "./_components/breadcrumb-wrapper"
import { OrderDetailsWrapper } from "./_components/order-details-wrapper"

type Params = Promise<{ id: string }>

export const experimental_ppr = true
export default function FarmerOrderDetailsPage({ params }: { params: Params }) {
	return (
		<>
			<DashboardHeader />
			<div className="space-y-4 px-4 py-5 lg:px-5">
				<div className="">
					<BreadcrumbWrapper params={params} />
					<div className="mx-auto w-full max-w-4xl space-y-4 py-5 lg:px-5">
						<Suspense fallback={<p> Loading... </p>}>
							<OrderDetailsWrapper params={params} />
						</Suspense>
					</div>
				</div>
			</div>
		</>
	)
}
