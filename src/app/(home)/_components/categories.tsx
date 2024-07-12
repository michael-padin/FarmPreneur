import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Apple, Carrot, Egg, Bean } from "lucide-react"
import {
	Carousel,
	CarouselContent,
	CarouselItem
} from "@/components/ui/carousel"
import { Label } from "@/components/ui/label"

const categories = [
	{ name: "Fruits", icon: Apple },
	{ name: "Vegetables", icon: Carrot },
	{ name: "Eggs", icon: Egg },
	{ name: "Seeds", icon: Bean }
]

// Define the structure of the color map
interface ColorMap {
	[key: string]: {
		background: string
		color: string
	}
}
// Define background and text/icon colors with lighter backgrounds
const colorMap: ColorMap = {
	Fruits: {
		background: "bg-red-100", // Lighter red background
		color: "text-red-600"
	},
	Vegetables: {
		background: "bg-green-100", // Lighter green background
		color: "text-green-600"
	},
	Eggs: {
		background: "bg-yellow-100", // Lighter yellow background
		color: "text-yellow-600"
	},
	Seeds: {
		background: "bg-orange-100", // Lighter brown or orange-like background
		color: "text-orange-600"
	}
}

export default function Categories() {
	return (
		<section className="container mx-auto -mt-16 rounded-lg px-0 py-5 lg:-mt-0 lg:px-4">
			<div className="">
				<div className="relative rounded-md bg-background">
					<Carousel
						className="overflow-hidden p-2"
						opts={{
							align: "start",
							dragFree: true
						}}
					>
						<h1 className="mb-2 font-semibold text-primary lg:text-2xl">
							Categories
						</h1>
						<CarouselContent className="-ml-2 flex">
							{[...categories, ...categories].map((category) => {
								const styles = colorMap[category.name] || {}
								return (
									<CarouselItem
										key={category.name}
										className="basis-[30%] pl-2 lg:basis-[16%]"
									>
										<Card
											className={`overflow-hidden ${styles.background} border-none`}
										>
											<CardContent className="flex flex-col items-center justify-center p-4">
												<category.icon className={`h-8 w-8 ${styles.color}`} />
												<span className={`text-xs ${styles.color}`}>
													{category.name}
												</span>
											</CardContent>
										</Card>
									</CarouselItem>
								)
							})}
						</CarouselContent>
					</Carousel>
				</div>
			</div>
		</section>
	)
}
