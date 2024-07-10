/* eslint-disable @next/next/no-img-element */
"use client"
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	Star,
	Stars,
	UserIcon
} from "lucide-react"
import Link from "next/link"
import Slider, { Settings } from "react-slick"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from "@/components/ui/carousel"

const settings: Settings = {
	dots: true,
	infinite: true,
	speed: 500,
	swipe: true,
	slidesToShow: 1,
	slidesToScroll: 1
}

const formatPrice = (price: number, unit: string) => {
	return `₱${price.toFixed(2)} / ${unit}`
}

const truncateText = (description: string, maxLength: number) => {
	if (description.length > maxLength) {
		return description.substring(0, maxLength) + "..."
	}
	return description
}

interface ProductCardProps {
	images: string[]
	title: string
	price: number
	farmer: string
	unit: string
	description: string
}

export default function ProductCard({
	images,
	title,
	price,
	farmer,
	unit,
	description
}: ProductCardProps) {
	return (
		<div className="relative overflow-hidden rounded-lg bg-white">
			<Carousel className="w-full overflow-hidden rounded-md">
				<CarouselContent>
					{images.length > 0 ? (
						images.map((image, index) => (
							<CarouselItem key={index}>
								<img
									key={index}
									alt={title}
									className="h-48 w-full rounded-md object-cover"
									height="200"
									src={image}
									style={{
										aspectRatio: "300/200",
										objectFit: "cover"
									}}
									width="300"
								/>
							</CarouselItem>
						))
					) : (
						<img
							alt={title}
							className="h-48 w-full object-cover"
							height="200"
							src={images[0]}
							style={{
								aspectRatio: "300/200",
								objectFit: "cover"
							}}
							width="300"
						/>
					)}
				</CarouselContent>
				<CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/50 p-2 text-gray-900 hover:bg-white">
					<ChevronLeftIcon className="h-5 w-5" />
				</CarouselPrevious>
				<CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/50 p-2 text-gray-900 hover:bg-white">
					<ChevronRightIcon className="h-5 w-5" />
				</CarouselNext>
			</Carousel>
			<div className="overflow-hidden py-2">
				<div className="flex items-center gap-2">
					<Avatar className="h-6 w-6">
						<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
						<AvatarFallback>{`${"fa"}`}</AvatarFallback>
					</Avatar>
					<p className="text-sm text-[#222325]">{farmer}</p>
				</div>
				<Link href={`${"/products/1"}`} className="hover:underline">
					<h2 className="text-base font-semibold">{title}</h2>
				</Link>
				<p className="text-sm">{truncateText(description, 75)}</p>
				<div className="my-2 flex items-center gap-1">
					<div className="flex items-center gap-1">
						<Star size={15} className="fill-gray-900 stroke-transparent" />
						<span className="text-sm">5.0</span>
					</div>
					<div>{`${"(102)"}`}</div>
				</div>
				<div className="flex items-center justify-between">
					<p className="text-base font-semibold text-primary">
						{formatPrice(price, unit)}
					</p>
				</div>
			</div>
		</div>
	)
}
