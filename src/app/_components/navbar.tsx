"use client"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
	{ name: "Become a farmer", link: "signup" },
	{ name: "Sign in", link: "login" },
	{ name: "Join", link: "signup" }
]

const Navbar = () => {
	return (
		<nav>
			<ul className="mt-4 hidden flex-col items-center rounded-lg border p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:p-0 lg:flex rtl:space-x-reverse">
				{navItems.map((item, idx) => (
					<li key={idx}>
						<Link
							href={`/${item.link}`}
							className={`${
								item.name === "Join"
									? cn(
											buttonVariants({ variant: "outline" }),
											"border-primary text-primary outline-primary hover:bg-transparent hover:text-primary"
										)
									: ""
							} `}
						>
							{item.name}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	)
}

export default Navbar
