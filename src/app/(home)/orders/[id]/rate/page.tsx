import { FPBackButton } from "@/components/fp/fp-back-button"
import { Suspense } from "react"
import ReviewFormSkeleton from "./_components/rate-form-skeleton.tsx"
import { RateFormWrapper } from "./_components/rate-form-wrapper"

type Params = Promise<{ id: string }>
export const experimental_ppr = true

export default function RatePage({ params }: { params: Params }) {
	return (
		<div className="h-screen overflow-auto bg-secondary">
			<header className="fixed left-0 right-0 top-0 z-50 w-full bg-background pb-0 shadow-sm">
				<div className="flex w-full items-center gap-2 px-4 py-4">
					<FPBackButton />
					<h1 className="text-xl font-semibold">Rate</h1>
				</div>
			</header>
			<main>
				<div className="w-full space-y-2 px-2 lg:px-5">
					<div className="">
						<div className="">
							<div className="pb-20 pt-20">
								<Suspense
									fallback={
										<div className="space-y-2">
											<ReviewFormSkeleton />
										</div>
									}
								>
									<RateFormWrapper params={params} />
								</Suspense>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}
