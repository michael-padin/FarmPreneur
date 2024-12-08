import { getCartServerFunction } from "@/actions/cart"
import { auth } from "@/auth"
import { CartProvider } from "@/contexts/cart-context"
import { redirect } from "next/navigation"
import UnderConstruction from "./_components/under-construction"

export default async function Layout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await auth()
	const user = session?.user

	if (user?.role === "FARMER") redirect("/dashboard/farmer")
	if (user?.role === "ADMIN") redirect("/dashboard")

	const cartPromise = getCartServerFunction(user?.customerId || "")
	return (
		<CartProvider initialCartPromise={cartPromise}>
			<UnderConstruction />
			<div className="lg:hidden">{children}</div>
		</CartProvider>
	)
}
