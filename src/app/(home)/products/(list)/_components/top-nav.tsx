import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ProductListNavLinks } from "./nav-links"

export async function TopNav() {
	const session = await auth()

	return (
		<div>
			{session?.user ? (
				<ProductListNavLinks />
			) : (
				<Button asChild>
					<Link href="/signup">Sign up</Link>
				</Button>
			)}
		</div>
	)
}
