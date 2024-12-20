"use client"

import { FPBackButton } from "@/components/fp/fp-back-button"
import { FPMessageCircleMore } from "@/components/fp/fp-message-circle-more"
import { FPSearchSheet } from "@/components/fp/fp-search-sheet"
import { FPShoppingCart } from "@/components/fp/fp-shopping-cart"
import { Input } from "@/components/ui/input"
import { useScrollDetection } from "@/hooks/use-scroll-detection"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import Image from "next/image"

export function TopNav() {
	const scrolled = useScrollDetection({ threshold: 60 })

	const containerClasses = cn(
		scrolled ? "bg-transparent text-primary" : "bg-black/40 text-white"
	)

	const badgeClasses = cn("bg-primary text-primary-foreground")

	return (
		<>
			<div
				className={cn(
					"fixed left-0 right-0 top-0 z-10 md:hidden lg:sticky",
					scrolled ? "bg-white shadow-md" : "bg-transparent"
				)}
			>
				<div className="flex items-center justify-between p-3 px-1.5">
					<FPBackButton className={containerClasses} />
					<div className="flex gap-2">
						<FPSearchSheet triggerClassName={`${containerClasses}`} />
						<FPShoppingCart
							containerClassName={containerClasses}
							badgeClassName={badgeClasses}
						/>
						<FPMessageCircleMore
							containerClassName={containerClasses}
							className={badgeClasses}
						/>
					</div>
				</div>
			</div>
			<div className="hidden bg-primary md:block">
				<div className="container flex items-center justify-between py-4">
					<div className="flex items-center gap-2">
						<Image
							className="rounded-lg object-cover"
							src={"/web-app-manifest-512x512.png"}
							alt={"FarmerPreneur Logo"}
							width={40}
							height={40}
							priority
							sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
						/>
						<h1
							className={`font-bold ${scrolled ? "text-primary" : "text-primary-foreground"}`}
						>
							FarmPreneur
						</h1>
					</div>
					<div className="">
						<div className="flex items-center gap-4">
							<div className="relative w-full">
								<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder="Search products or categories."
									className="w-full pl-10"
									// onChange={(e) => debouncedSetFilterValues(e.target.value)}
									// defaultValue={search}
								/>
							</div>
							<FPShoppingCart
								containerClassName={"bg-transparent text-white"}
								badgeClassName={"bg-white text-primary border-primary"}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
