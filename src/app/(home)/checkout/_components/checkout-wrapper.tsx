import { auth } from "@/auth"
import { redirect } from "next/navigation"
import CartCheckOutList from "./checkout-list"

export async function CheckoutWrapper({
	searchParams
}: {
	searchParams?: Promise<{
		productId?: string
		quantity?: number
		from: "cart" | "product"
	}>
}) {
	const params = await searchParams
	const session = await auth()

	if (!session) {
		redirect("/login")
	}

	if (session.user.role !== "CUSTOMER") {
		redirect("/login")
	}

	return <>{params?.from === "cart" ? <CartCheckOutList /> : <div></div>}</>
}
