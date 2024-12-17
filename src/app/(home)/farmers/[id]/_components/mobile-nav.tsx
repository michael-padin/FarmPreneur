"use client"
import { FPSearchSheet } from "@/components/fp/fp-search-sheet"
import { FPShoppingCart } from "@/components/fp/fp-shopping-cart"
import { Button } from "@/components/ui/button"
import { useScrollDetection } from "@/hooks/use-scroll-detection"
import { cn } from "@/lib/utils"
import { Session } from "next-auth"
import Image from "next/image"
import Link from "next/link"

export function MobileNav({ user }: { user?: Session["user"] }) {
	const scrolled = useScrollDetection({ threshold: 60 })

	const containerClasses = cn(
		scrolled ? "bg-transparent text-primary" : "bg-transparent text-white"
	)
	const badgeClasses = cn(
		scrolled ? "bg-primary text-white" : "bg-white text-primary border-primary"
	)
	return (
		<div
			className={cn(
				"fixed left-0 right-0 top-0 z-10 p-3",
				scrolled ? "bg-white shadow-md" : "bg-white"
			)}
		>
			<div className="flex items-center justify-between gap-4 lg:container">
				<div className="flex items-center gap-2">
					{/* <div
						className={`flex min-h-10 min-w-10 items-center justify-center rounded-lg bg-background font-bold text-primary ${scrolled ? "bg-primary text-white" : ""}`}
					>
						<h1>FP</h1>
					</div> */}
					<Image
						className="rounded-lg border object-cover"
						src={"/web-app-manifest-512x512.png"}
						alt={"FarmerPreneur Logo"}
						width={40}
						height={40}
						priority
						sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
					/>
					<h1 className={`font-bold text-primary`}>FarmPreneur</h1>
				</div>

				<div className="flex items-center gap-2 text-primary-foreground">
					<FPSearchSheet triggerClassName={containerClasses} />
					{user ? (
						<>
							<FPShoppingCart
								badgeClassName={"bg-primary text-white"}
								containerClassName={`bg-transparent text-primary`}
							/>
							{/* <FPMessageCircleMore
								className={badgeClasses}
								containerClassName={containerClasses}
							/> */}
						</>
					) : (
						<div className="flex items-center gap-4">
							<Button variant={scrolled ? "default" : "secondary"} asChild>
								<Link href="/signup">Sign up</Link>
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
