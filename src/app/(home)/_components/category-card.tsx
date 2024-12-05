import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface CategoryCardProps {
	title: string
	description: string
	imageUrl: string
}

export function CategoryCard({
	title,
	description,
	imageUrl
}: CategoryCardProps) {
	return (
		<Card className="border-none">
			<CardContent className="w-28 p-0">
				<div className="relative h-20 overflow-hidden rounded-lg">
					<Image
						src={imageUrl}
						alt={title}
						fill
						priority
						className="h-full w-full object-cover"
					/>
				</div>
				<div className="px-1 py-2">
					<h3 className="mb-2 truncate text-sm font-semibold text-primary">
						{title}
					</h3>
					{/* <p className="line-clamp-2 text-sm text-muted-foreground">
						{description}
					</p> */}
				</div>
			</CardContent>
		</Card>
	)
}
