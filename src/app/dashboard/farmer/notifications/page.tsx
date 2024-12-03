import { Metadata } from "next"
import { Suspense } from "react"
import { ReadAllButton } from "./_components/read-all-button"
import { BottomNav } from "../_components/bottom-navigation"
import { NotificationSkeleton } from "./_components/notification-skeleton"
import { NotificationListWrapper } from "./_components/notification-list-wrapper"

export const experimental_ppr = true

export const metadata: Metadata = {
	title: "Notifications"
}

export default function Page() {
	return (
		<main className="w-full">
			<header className="fixed left-0 right-0 top-0 z-50 w-full border-b bg-background pb-0 md:hidden">
				<div className="flex w-full items-center justify-between p-4">
					<h1 className="text-2xl font-semibold">Notifications</h1>
					<div className="flex items-center gap-2">
						<ReadAllButton />
					</div>
				</div>
			</header>
			<div className="pb-24 pt-16">
				<div className="px-4 pt-4">
					<Suspense fallback={<NotificationSkeleton />}>
						<NotificationListWrapper />
					</Suspense>
				</div>
			</div>
			<BottomNav />
		</main>
	)
}
