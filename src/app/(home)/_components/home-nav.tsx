import { auth } from "@/auth"
import DesktopNav from "./desktop-nav"
import { MobileNav } from "./mobile-nav"

export async function HomeNav() {
	const session = await auth()

	return (
		<>
			<MobileNav user={session?.user} />
			<DesktopNav />
		</>
	)
}
