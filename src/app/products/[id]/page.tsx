"use client"
import { MinusIcon, PlusIcon } from "lucide-react"
import Link from "next/link"

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/XQyO7EHnAuO
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from "@/components/ui/carousel"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Navbar } from "@/app/_components"

export default function Component() {
	return (
		<>
			<header className="fixed inset-x-0 top-0 z-10 border-b bg-white">
				<div className="container mx-auto flex h-20 items-center justify-between px-4">
					<Link
						className="flex items-center gap-2 text-3xl font-black text-[#404145]"
						href="/"
					>
						<img src="/logo.svg" alt="" className="h-[50px] w-[50px]" />
						Farm2go
					</Link>
					<Navbar />
				</div>
			</header>
			<div className="lg:gap-12b container mx-auto grid items-start gap-6 px-4 py-24 md:grid-cols-2">
				<div className="grid gap-4">
					<Carousel className="overflow-hidden rounded-lg">
						<CarouselContent>
							<CarouselItem>
								<img
									alt="Product Image"
									className="aspect-square object-cover"
									height={600}
									src="/placeholder.svg"
								/>
							</CarouselItem>
							<CarouselItem>
								<img
									alt="Product Image"
									className="aspect-square object-cover"
									height={600}
									src="/placeholder.svg"
								/>
							</CarouselItem>
							<CarouselItem>
								<img
									alt="Product Image"
									className="aspect-square object-cover"
									height={600}
									src="/placeholder.svg"
								/>
							</CarouselItem>
						</CarouselContent>
						<CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/50 p-2 text-gray-900 hover:bg-white">
							<ChevronLeftIcon className="h-5 w-5" />
						</CarouselPrevious>
						<CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/50 p-2 text-gray-900 hover:bg-white">
							<ChevronRightIcon className="h-5 w-5" />
						</CarouselNext>
					</Carousel>
				</div>
				<div className="grid gap-6">
					<div className="flex items-center gap-4">
						<Avatar className="h-10 w-10">
							<AvatarImage alt="Seller Avatar" src="/placeholder-user.jpg" />
							<AvatarFallback>JS</AvatarFallback>
						</Avatar>
						<div className="grid gap-1">
							<h3 className="font-medium">John Doe</h3>
							<p className="text-sm text-gray-500 dark:text-gray-400">Farmer</p>
						</div>
					</div>
					<div className="grid gap-8">
						<h1 className="text-2xl font-bold">Organic Apples</h1>
						<p className="text-gray-500 dark:text-gray-400">
							Crisp, delicious organic apples grown without synthetic pesticides
							or fertilizers. Perfect for snacking, baking, or adding to salads.
						</p>
						<div className="flex items-center gap-4">
							<div className="text-2xl font-bold">₱100/kg</div>
							<div className="rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
								Fruits
							</div>
						</div>
						<div className="grid gap-2">
							<Label className="text-base" htmlFor="quantity">
								Quantity
							</Label>
							<div className="flex items-center gap-2">
								<div className="flex w-[100px] items-center justify-between gap-2 rounded-md bg-gray-100 px-3 py-2 dark:bg-gray-800">
									<Button
										className="h-4 w-4 text-gray-500 hover:bg-transparent dark:text-gray-400"
										size="icon"
										variant="ghost"
									>
										<MinusIcon className="h-4 w-4" />
										<span className="sr-only">Decrease quantity</span>
									</Button>
									<span className="text-base font-medium">1</span>
									<Button
										className="h-4 w-4 text-gray-500 hover:bg-transparent dark:text-gray-400"
										size="icon"
										variant="ghost"
									>
										<PlusIcon className="h-4 w-4" />
										<span className="sr-only">Increase quantity</span>
									</Button>
								</div>
							</div>
						</div>
					</div>
					<div className="flex w-1/2 gap-2">
						<Link
							href="/login"
							className={cn(buttonVariants({ variant: "outline" }), "w-1/2")}
						>
							Add to Cart
						</Link>
						<Link
							href="/login"
							className={cn(buttonVariants({ variant: "default" }), "w-1/2")}
						>
							Buy Now
						</Link>
					</div>
				</div>
			</div>
		</>
	)
}

function ChevronLeftIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="m15 18-6-6 6-6" />
		</svg>
	)
}

function ChevronRightIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="m9 18 6-6-6-6" />
		</svg>
	)
}
