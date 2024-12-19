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
		<Card className="group border-none">
			<CardContent className="h-32 w-full p-0 lg:w-full">
				<div className="relative h-20 overflow-hidden rounded-lg lg:h-32">
					<Image
						src={imageUrl}
						alt={title}
						fill
						sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
						priority
						className="h-full w-full object-cover"
					/>
				</div>
				<div className="px-1 pt-2">
					<h3 className="truncate text-xs group-hover:underline lg:text-lg">
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
