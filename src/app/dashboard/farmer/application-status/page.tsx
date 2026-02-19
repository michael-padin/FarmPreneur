import { FPLinkBackButton } from "@/components/fp/fp-back-button"
import { Loader2 } from "lucide-react"
import { Suspense } from "react"
import { FarmerApplicationStatusWrapper } from "./farmer-application-status-wrapper"

//export const experimental_ppr = true

export default function ApplicationStatusPage() {
	return (
		<div className="w-full space-y-4 px-4 lg:px-5">
			<header className="fixed left-0 right-0 top-0 z-50 w-full border-b bg-background pb-0 shadow-sm">
				<div className="flex w-full items-center gap-2 px-4 py-4">
					<FPLinkBackButton
						href="/dashboard/farmer/profile"
						className="h-8 w-8"
					/>
					<h1 className="text-xl font-semibold">Application Status</h1>
				</div>
			</header>
			<div className="pb-4 pt-16">
				<Suspense
					fallback={
						<div className="mt-10 flex w-full items-center justify-center">
							<Loader2 className="h-5 w-5 animate-spin text-primary" />
						</div>
					}
				>
					<FarmerApplicationStatusWrapper />
				</Suspense>
			</div>
		</div>
	)
}
