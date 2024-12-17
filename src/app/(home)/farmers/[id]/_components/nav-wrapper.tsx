import { auth } from "@/auth"
import { MobileNav } from "./mobile-nav"

export async function NavWrapper() {
	const user = (await auth())?.user

	return <MobileNav user={user} />
}
