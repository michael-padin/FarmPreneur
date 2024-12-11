import { auth } from "@/auth"
import { ProductListNavLinks } from "./nav-links"

export async function TopNav() {
	const session = await auth()

	if (!session?.user) {
		return <div></div>
	}
	return <div>{session.user && <ProductListNavLinks />}</div>
}
