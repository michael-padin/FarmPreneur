"use client"
import { FPMessageCircleMore } from "@/components/fp/fp-message-circle-more"
import { FPSearchSheet } from "@/components/fp/fp-search-sheet"
import { FPShoppingCart } from "@/components/fp/fp-shopping-cart"
import { useScrollDetection } from "@/hooks/use-scroll-detection"
import { cn } from "@/lib/utils"
import { Session } from "next-auth"
import Image from "next/image"

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
				scrolled ? "bg-white shadow-md" : "bg-primary"
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
						className="rounded-lg object-cover"
						src={"/web-app-manifest-512x512.png"}
						alt={"FarmerPreneur Logo"}
						width={40}
						height={40}
						priority
						sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
					/>
					<p
						className={`font-bold ${scrolled ? "text-primary" : "text-primary-foreground"}`}
					>
						FarmPreneur
					</p>
				</div>

				<div className="flex items-center gap-2 text-primary-foreground">
					<FPSearchSheet triggerClassName={containerClasses} />
					{user ? (
						<>
							<FPShoppingCart
								badgeClassName={badgeClasses}
								containerClassName={containerClasses}
							/>
							<FPMessageCircleMore
								className={badgeClasses}
								containerClassName={containerClasses}
							/>
						</>
					) : (
						""
					)}
				</div>
			</div>
		</div>
	)
}
