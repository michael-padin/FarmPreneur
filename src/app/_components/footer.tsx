"use client"
import Link from "next/link"

export default function Footer() {
	return (
		<footer className="mt-8 bg-gray-100 py-6">
			<div className="container mx-auto flex items-center justify-between px-4">
				<p className="text-gray-500">{"© 2023 Farmer's Market"}</p>
				<nav className="flex items-center gap-4">
					<Link className="text-gray-900 hover:underline" href="#">
						About
					</Link>
					<Link className="text-gray-900 hover:underline" href="#">
						Contact
					</Link>
					<Link className="text-gray-900 hover:underline" href="#">
						FAQ
					</Link>
				</nav>
			</div>
		</footer>
	)
}
