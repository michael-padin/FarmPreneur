import { Suspense } from "react"
import { BreadcrumbWrapper } from "./_components/breadcrumb-wrapper"
import { FarmerDetailsWrapper } from "./_components/farmer-details-wrapper"

//export const experimental_ppr = true

type Params = Promise<{ id: string }>

export default function FarmerDetailsPage(props: { params: Params }) {
	return (
		<div className="">
			<BreadcrumbWrapper params={props.params} />
			<div className="mx-auto w-full max-w-2xl space-y-4 py-5 lg:px-5">
				<Suspense fallback={<p> Loading... </p>}>
					<FarmerDetailsWrapper params={props.params} />
				</Suspense>
			</div>
		</div>
	)
}
