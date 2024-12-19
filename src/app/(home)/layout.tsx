import { auth } from "@/auth"
import { CartProvider } from "@/contexts/cart-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { getCartUseCase } from "@/use-cases/cart"
import { getNotificationsByUserIdUseCase } from "@/use-cases/notifications"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import UnderConstruction from "./_components/under-construction"

import ogImage from "../opengraph-image.png"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
	? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
	: "http://localhost:3000"
export const experimental_ppr = true

export const metadata: Metadata = {
	title: "Local Farmers Marketplace",
	verification: {
		google: "google",
		yandex: "yandex",
		yahoo: "yahoo",
		other: {
			me: ["padinmichael201@gmail.com"]
		}
	},
	description:
		"Discover and purchase fresh, locally-grown produce from farmers in your area. Support local agriculture with FarmPreneur.",
	openGraph: {
		type: "website",
		url: baseUrl,
		description:
			"Discover and purchase fresh, locally-grown produce from farmers in your area. Support local agriculture with FarmPreneur.",
		siteName: "FarmPreneur",
		images: [
			{
				url: ogImage.src,
				width: ogImage.width,
				height: ogImage.height,
				alt: "FarmPreneur - Local Farmers Marketplace"
			}
		]
	}
}

export default async function Layout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await auth()
	const user = session?.user

	if (user?.role === "FARMER") redirect("/dashboard/farmer")
	if (user?.role === "ADMIN") redirect("/dashboard")

	const cartPromise = getCartUseCase(user?.cartId || "")
	const initialNotificationsPromise = getNotificationsByUserIdUseCase()

	return (
		<NotificationProvider
			initialNotificationsPromise={initialNotificationsPromise}
			userId={user?.id}
		>
			<CartProvider initialCartPromise={cartPromise}>
				<UnderConstruction />
				{children}
			</CartProvider>
		</NotificationProvider>
	)
}
