"use client"
import { FPSearchSheet } from "@/components/fp/fp-search-sheet"
import { Button } from "@/components/ui/button"
import { useScrollDetection } from "@/hooks/use-scroll-detection"
import { cn } from "@/lib/utils"
import { Session } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { FarmerPageNavLinks } from "./nav-links"

export function MobileNav({ user }: { user?: Session["user"] }) {
	const scrolled = useScrollDetection({ threshold: 60 })
	const containerClasses = cn("bg-transparent text-primary")
	const badgeClasses = cn("bg-primary text-white")

	return (
		<div
			className={cn(
				"fixed left-0 right-0 top-0 z-10 p-3",
				scrolled ? "bg-white shadow-md" : "bg-white"
			)}
		>
			<div className="flex items-center justify-between gap-4 lg:container">
				<Link className="flex items-center gap-2" href={"/"}>
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
				</Link>

				<div className="flex items-center gap-2 text-primary-foreground">
					{user ? (
						<FarmerPageNavLinks />
					) : (
						<div className="flex items-center gap-2">
							<FPSearchSheet triggerClassName={containerClasses} />
							{/* <Button variant={"secondary"} asChild>
								<Link href="/signup">Sign up</Link>
							</Button> */}
							<Button variant={"default"} asChild>
								<Link href="/login">Log in</Link>
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
