"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageCircleMore, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function TopNav() {
	const router = useRouter()
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			// if the window is scrolled down by at least 60 pixels, set the scrolled state to true
			const isScrolled = window.scrollY > 60
			if (isScrolled !== scrolled) {
				setScrolled(isScrolled)
			}
		}

		document.addEventListener("scroll", handleScroll, { passive: true })

		return () => {
			document.removeEventListener("scroll", handleScroll)
		}
	}, [scrolled])

	return (
		<div
			className={`fixed left-0 right-0 top-0 z-10 ${scrolled ? "bg-white shadow-md" : "bg-transparent"}`}
		>
			<div className="flex items-center justify-between p-3 px-1.5">
				<div
					className={`flex items-center justify-center rounded-full p-1.5 ${scrolled ? "bg-transparent text-primary" : "bg-black/20 text-white"}`}
				>
					<Button
						size={"icon"}
						className={"cursor-pointer hover:bg-transparent hover:text-current"}
						variant={"ghost"}
						asChild
						onClick={() => router.back()}
					>
						<ArrowLeft className="h-6 w-6" />
					</Button>
				</div>
				<div className="flex gap-3">
					<div
						className={`flex items-center justify-center rounded-full p-1.5 ${scrolled ? "bg-transparent text-primary" : "bg-black/20 text-white"}`}
					>
						<Button
							size={"icon"}
							className={
								"cursor-pointer hover:bg-transparent hover:text-current"
							}
							variant={"ghost"}
							asChild
						>
							<ShoppingCart className={`h-6 w-6`} />
						</Button>
					</div>
					<div
						className={`flex items-center justify-center rounded-full p-1.5 ${scrolled ? "bg-transparent text-primary" : "bg-black/20 text-white"}`}
					>
						<Button
							size={"icon"}
							className={
								"cursor-pointer hover:bg-transparent hover:text-current"
							}
							variant={"ghost"}
							asChild
						>
							<MessageCircleMore className={`h-6 w-6`} />
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
