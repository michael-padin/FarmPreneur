import { Metadata } from "next"
import { auth } from "@/auth"
import { NotificationList } from "./_components/notification-list"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import { ReadAllButton } from "./_components/read-all-button"
import { BottomNav } from "../_components/bottom-navigation"
import { MessageCircleMore } from "lucide-react"
import { getNotificationsByUserIdUseCase } from "@/use-cases/notifications"
import { NotificationSkeleton } from "./_components/notification-skeleton"

export const metadata: Metadata = {
	title: "Notifications"
}

export default async function Page() {
	const session = await auth()
	const user = session?.user

	if (!user) {
		return <div>You are not logged in</div>
	}

	const notificationsPromise = getNotificationsByUserIdUseCase(user.id)

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
					<Suspense fallback={<NotificationSkeleton />} key={user.id}>
						<NotificationList notificationsPromise={notificationsPromise} />
					</Suspense>
				</div>
			</div>
			<BottomNav />
		</main>
	)
}
