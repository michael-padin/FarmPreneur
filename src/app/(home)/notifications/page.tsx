import { Metadata } from "next"
import { Suspense } from "react"
import { BottomNav } from "../_components"
import { NotificationListWrapper } from "./_components/notification-list-wrapper"
import { NotificationSkeleton } from "./_components/notification-skeleton"
import { NotificationsNavLinks } from "./nav-links"

export const experimental_ppr = true

export const metadata: Metadata = {
	title: "Notifications"
}

export default function Page() {
	return (
		<>
			<header className="fixed left-0 right-0 top-0 z-50 w-full border-b bg-background pb-0 md:hidden">
				<div className="flex w-full items-center justify-between p-4">
					<div className="flex items-center gap-2">
						{/* <div
							className={`flex min-h-10 min-w-10 items-center justify-center rounded-lg bg-background font-bold text-primary ${"bg-primary text-white"}`}
						>
							<h1>FP</h1>
						</div> */}
						<div className="">
							<h2 className={`text-xs font-bold ${"text-primary"}`}>
								FarmPreneur
							</h2>
							<h1 className="text-2xl font-bold">Notifications</h1>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{/* <ReadAllButton /> */}
						<NotificationsNavLinks />
					</div>
				</div>
			</header>
			<main className="w-full">
				<div className="pb-24 pt-16">
					<div className="px-4 pt-4">
						<Suspense fallback={<NotificationSkeleton />}>
							<NotificationListWrapper />
						</Suspense>
					</div>
				</div>
				<BottomNav />
			</main>
		</>
	)
}
