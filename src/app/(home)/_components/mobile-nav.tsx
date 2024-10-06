import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircleMore, Search, ShoppingCart } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import IconBadge from "@/components/fg/fg-icon-badge"
import { auth } from "@/auth"

const MobileNav = async () => {
	const session = await auth()
	return (
		<div
			className={`fixed z-10 w-full ${session?.user ? "bg-primary" : "bg-white"} p-4 lg:hidden`}
		>
			<div className="flex items-center justify-between gap-4 lg:container">
				{session?.user ? (
					<div className="w-full">
						<Input placeholder="Search" className="w-full" />
					</div>
				) : (
					<div>
						<h1 className="text-xl font-bold text-primary">FarmPreneur</h1>
					</div>
				)}

				{session?.user ? (
					<div className="flex items-center gap-4 text-primary-foreground">
						<Link href={`/cart`}>
							<IconBadge
								icon={ShoppingCart}
								count={12}
								variant="ghost"
								className="hover:bg-transparent hover:text-white"
							/>
						</Link>
						<IconBadge
							icon={MessageCircleMore}
							count={12}
							variant="ghost"
							className="hover:bg-transparent hover:text-white"
						/>
					</div>
				) : (
					<div className="flex items-center gap-4">
						<Search className="text-foreground" />
						<Button variant="default" asChild>
							<Link href="/signup">Sign up</Link>
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}

export default MobileNav
