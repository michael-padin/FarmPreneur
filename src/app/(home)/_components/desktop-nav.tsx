import { Navbar } from "@/app/_components"
import Link from "next/link"

const DesktopNav = () => {
	return (
		<header className="fixed inset-x-0 top-0 z-10 hidden border-b bg-white lg:block">
			<div className="container mx-auto flex h-20 items-center justify-between px-4">
				<Link
					className="flex items-center gap-2 text-3xl font-black text-[#404145]"
					href="/"
				>
					<img
						src="/web-app-manifest-512x512.png"
						alt=""
						className="h-[50px] w-[50px]"
					/>
					Farm2go
				</Link>
				<Navbar />
			</div>
		</header>
	)
}

export default DesktopNav
