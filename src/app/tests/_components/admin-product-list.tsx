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
import { ChevronDown, MoreVertical, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Product {
	id: string
	image: string
	title: string
	status: "PENDING" | "ACTIVE" | "INACTIVE"
	description: string
	farmer: string
	price: number
	unit: string
	quantity: number
	location: string
	orders: number
	reviews: number
	createdAt: string
	updatedAt: string
}

const products: Product[] = [
	{
		id: "1",
		image: "/placeholder.svg?height=64&width=64",
		title: "Mango",
		status: "PENDING",
		description:
			"Sweet and juicy Philippine mangoes, known for their vibrant flavor.",
		farmer: "Deal Farmer",
		price: 40.0,
		unit: "Kilogram",
		quantity: 100,
		location: "Argao, Cebu, Philippines",
		orders: 0,
		reviews: 0,
		createdAt: "November 15, 2024",
		updatedAt: "November 17, 2024"
	},
	{
		id: "2",
		image: "/placeholder.svg?height=64&width=64",
		title: "Banana (Lakatan)",
		status: "PENDING",
		description: "Ripe Lakatan bananas, perfect for snacks and smoothies.",
		farmer: "Kael Farmer",
		price: 40.0,
		unit: "Kilogram",
		quantity: 100,
		location: "Argao, Cebu, Philippines",
		orders: 0,
		reviews: 0,
		createdAt: "November 15, 2024",
		updatedAt: "November 15, 2024"
	},
	{
		id: "3",
		image: "/placeholder.svg?height=64&width=64",
		title: "Carrot Presko",
		status: "PENDING",
		description:
			"Fresh and organic carrots, rich in beta-carotene and antioxidants.",
		farmer: "Deal Farmer",
		price: 25.0,
		unit: "Kilogram",
		quantity: 100,
		location: "Argao, Cebu, Philippines",
		orders: 0,
		reviews: 0,
		createdAt: "November 17, 2024",
		updatedAt: "November 17, 2024"
	}
]

export default function ProductDashboard() {
	return (
		<div className="container mx-auto space-y-4 p-4">
			{/* Header */}
			<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h1 className="text-2xl font-bold">Products</h1>
					<p className="text-muted-foreground">Manage products from farmers</p>
				</div>
				<Button className="w-full sm:w-auto">
					<Plus className="mr-2 h-4 w-4" />
					Add New Product
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

			{/* Mobile Product Cards */}
			<div className="grid gap-4 md:hidden">
				{products.map((product) => (
					<Card key={product.id}>
						<CardContent className="p-3">
							<div className="flex gap-3">
								<div className="relative h-16 w-16 flex-shrink-0">
									<Image
										src={product.image}
										alt={product.title}
										layout="fill"
										objectFit="cover"
										className="rounded-md"
									/>
								</div>
								<div className="min-w-0 flex-1">
									<div className="flex items-start justify-between">
										<div>
											<h3 className="truncate font-semibold">
												{product.title}
											</h3>
											<Badge
												variant="secondary"
												className="bg-yellow-100 text-xs text-yellow-800"
											>
												{product.status}
											</Badge>
										</div>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="-mr-2 h-8 w-8"
												>
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem>Edit</DropdownMenuItem>
												<DropdownMenuItem>Delete</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
									<p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
										{product.description}
									</p>
									<div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
										<div className="flex justify-between">
											<span className="font-medium">Price:</span>
											<span>₱{product.price.toFixed(2)}</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium">Quantity:</span>
											<span>{product.quantity}</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium">Unit:</span>
											<span>{product.unit}</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium">Farmer:</span>
											<span>{product.farmer}</span>
										</div>
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
							<th className="p-4 text-left">Image</th>
							<th className="p-4 text-left">Title</th>
							<th className="p-4 text-left">Listing Status</th>
							<th className="p-4 text-left">Description</th>
							<th className="p-4 text-left">Farmer</th>
							<th className="p-4 text-left">Price</th>
							<th className="p-4 text-left">Unit</th>
							<th className="p-4 text-left">Quantity</th>
							<th className="p-4 text-left">Pick Up Location</th>
							<th className="p-4 text-left">Orders</th>
							<th className="p-4 text-left">Reviews</th>
							<th className="p-4 text-left">Created At</th>
							<th className="p-4 text-left">Updated At</th>
							<th className="p-4 text-left">Actions</th>
						</tr>
					</thead>
					<tbody>
						{products.map((product) => (
							<tr key={product.id} className="border-b">
								<td className="p-4">
									<Image
										src={product.image}
										alt={product.title}
										width={48}
										height={48}
										className="rounded-lg object-cover"
									/>
								</td>
								<td className="p-4 font-medium">{product.title}</td>
								<td className="p-4">
									<Badge
										variant="secondary"
										className="bg-yellow-100 text-yellow-800"
									>
										{product.status}
									</Badge>
								</td>
								<td className="max-w-xs p-4">{product.description}</td>
								<td className="p-4">{product.farmer}</td>
								<td className="p-4">₱{product.price.toFixed(2)}</td>
								<td className="p-4">{product.unit}</td>
								<td className="p-4">{product.quantity}</td>
								<td className="p-4">
									<Link href="#" className="text-primary hover:underline">
										View in map
									</Link>
								</td>
								<td className="p-4">{product.orders}</td>
								<td className="p-4">{product.reviews}</td>
								<td className="p-4">{product.createdAt}</td>
								<td className="p-4">{product.updatedAt}</td>
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
				<p className="text-sm text-muted-foreground">1 to 3 of 3</p>
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
