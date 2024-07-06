/* eslint-disable @next/next/no-img-element */
"use client"
import Link from "next/link"

interface ProductCardProps {
	image: string
	title: string
	description: string
	link: string
}

export default function CategoryCard({
	image,
	title,
	description,
	link
}: ProductCardProps) {
	return (
		<Link className="overflow-hidden rounded-lg bg-white shadow" href={link}>
			<img
				alt={title}
				className="h-48 w-full object-cover"
				height="200"
				src={image}
				style={{
					aspectRatio: "300/200",
					objectFit: "cover"
				}}
				width="300"
			/>
			<div className="p-4">
				<h3 className="mb-2 text-lg font-bold">{title}</h3>
				<p className="text-gray-500">{description}</p>
			</div>
		</Link>
	)
}
