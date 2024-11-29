import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
	ChevronDown,
	MoreVertical,
	Plus,
	Package,
	LinkIcon,
	Calendar
} from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"

interface Category {
	id: string
	image: string
	name: string
	description: string
	slug: string
	products: number
	createdAt: string
	updatedAt: string
}

const categories: Category[] = [
	{
		id: "1",
		image: "/placeholder.svg?height=64&width=64",
		name: "Grains & Cereals",
		description:
			"Grains and cereals such as rice, corn, wheat, oats, and barley.",
		slug: "grains-and-cereals",
		products: 0,
		createdAt: "November 14, 2024",
		updatedAt: "November 14, 2024"
	},
	{
		id: "2",
		image: "/placeholder.svg?height=64&width=64",
		name: "Nuts & Seeds",
		description:
			"Edible nuts and seeds like almonds, peanuts, sunflower seeds, and sesame.",
		slug: "nuts-and-seeds",
		products: 0,
		createdAt: "November 14, 2024",
		updatedAt: "November 14, 2024"
	},
	{
		id: "3",
		image: "/placeholder.svg?height=64&width=64",
		name: "Fruits",
		description:
			"Fresh, dried, and tropical fruits including bananas, mangoes, apples, and berries.",
		slug: "fruits",
		products: 2,
		createdAt: "November 14, 2024",
		updatedAt: "November 14, 2024"
	},
	{
		id: "4",
		image: "/placeholder.svg?height=64&width=64",
		name: "Vegetables",
		description:
			"Fresh vegetables including leafy greens, root vegetables, and fruiting vegetables.",
		slug: "vegetables",
		products: 1,
		createdAt: "November 14, 2024",
		updatedAt: "November 14, 2024"
	},
	{
		id: "5",
		image: "/placeholder.svg?height=64&width=64",
		name: "Dairy",
		description:
			"Dairy products such as milk, cheese, butter, yogurt, and cream.",
		slug: "dairy",
		products: 0,
		createdAt: "November 14, 2024",
		updatedAt: "November 14, 2024"
	}
]

export default function CategoriesDashboard3() {
	return (
		<div className="container mx-auto space-y-4 p-4">
			{/* Header */}
			<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h1 className="text-2xl font-bold">Categories</h1>
					<p className="text-muted-foreground">Manage your categories</p>
				</div>
				<Button className="w-full bg-green-600 hover:bg-green-700 sm:w-auto">
					<Plus className="mr-2 h-4 w-4" />
					Add Category
				</Button>
			</div>

			{/* Filters */}
			<div className="flex flex-col gap-4 sm:flex-row">
				<Input placeholder="Filter name..." className="w-full sm:max-w-xs" />
				<div className="ml-auto flex gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="w-full sm:w-auto">
								Columns
								<ChevronDown className="ml-2 h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>Show All</DropdownMenuItem>
							<DropdownMenuItem>Hide All</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Button variant="outline" className="w-full sm:w-auto">
						Reset
					</Button>
				</div>
			</div>

			{/* Mobile Category Cards */}
			<div className="grid gap-4 md:hidden">
				{categories.map((category) => (
					<Card key={category.id} className="overflow-hidden">
						<CardContent className="p-0">
							<div className="flex items-center gap-3 bg-muted p-3">
								<div className="relative h-16 w-16 flex-shrink-0">
									<Image
										src={category.image}
										alt={category.name}
										layout="fill"
										objectFit="cover"
										className="rounded-md"
									/>
								</div>
								<div className="min-w-0 flex-1">
									<h3 className="truncate font-semibold">{category.name}</h3>
									<p className="line-clamp-2 text-sm text-muted-foreground">
										{category.description}
									</p>
								</div>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon" className="h-8 w-8">
											<MoreVertical className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem>Edit</DropdownMenuItem>
										<DropdownMenuItem>Delete</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
							<div className="space-y-2 p-3">
								<div className="flex items-center gap-2">
									<Badge variant="secondary" className="text-xs font-normal">
										<Package className="mr-1 h-3 w-3" />
										{category.products} Products
									</Badge>
									<Badge variant="secondary" className="text-xs font-normal">
										<LinkIcon className="mr-1 h-3 w-3" />
										{category.slug}
									</Badge>
								</div>
								<div className="flex justify-between text-xs text-muted-foreground">
									<div className="flex items-center">
										<Calendar className="mr-1 h-3 w-3" />
										Created:{" "}
										{format(new Date(category.createdAt), "MMM d, yyyy")}
									</div>
									<div className="flex items-center">
										<Calendar className="mr-1 h-3 w-3" />
										Updated:{" "}
										{format(new Date(category.updatedAt), "MMM d, yyyy")}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Desktop Table */}
			<div className="hidden overflow-x-auto md:block">
				<table className="w-full border-collapse">
					<thead>
						<tr className="border-b">
							<th className="p-4 text-left font-medium text-muted-foreground">
								Image
							</th>
							<th className="p-4 text-left font-medium text-muted-foreground">
								Name
							</th>
							<th className="p-4 text-left font-medium text-muted-foreground">
								Description
							</th>
							<th className="p-4 text-left font-medium text-muted-foreground">
								Slug
							</th>
							<th className="p-4 text-left font-medium text-muted-foreground">
								Products
							</th>
							<th className="p-4 text-left font-medium text-muted-foreground">
								Created At
							</th>
							<th className="p-4 text-left font-medium text-muted-foreground">
								Updated At
							</th>
							<th className="p-4 text-left font-medium text-muted-foreground">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{categories.map((category) => (
							<tr key={category.id} className="border-b">
								<td className="p-4">
									<div className="relative h-16 w-16">
										<Image
											src={category.image}
											alt={category.name}
											layout="fill"
											objectFit="cover"
											className="rounded-md"
										/>
									</div>
								</td>
								<td className="p-4 font-medium">{category.name}</td>
								<td className="max-w-xs p-4 text-muted-foreground">
									{category.description}
								</td>
								<td className="p-4 text-muted-foreground">{category.slug}</td>
								<td className="p-4">{category.products}</td>
								<td className="p-4 text-muted-foreground">
									{format(new Date(category.createdAt), "MMM d, yyyy")}
								</td>
								<td className="p-4 text-muted-foreground">
									{format(new Date(category.updatedAt), "MMM d, yyyy")}
								</td>
								<td className="p-4">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon">
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem>Edit</DropdownMenuItem>
											<DropdownMenuItem>Delete</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="flex items-center justify-between">
				<p className="text-sm text-muted-foreground">1 to 5 of 5</p>
				<div className="flex gap-2">
					<Button variant="outline" size="sm" disabled>
						Previous
					</Button>
					<Button variant="outline" size="sm" disabled>
						Next
					</Button>
				</div>
			</div>
		</div>
	)
}
