import {
	Search,
	SlidersHorizontal,
	MapPin,
	ShoppingBag,
	Star,
	Clock,
	ChevronRight,
	Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"
import Image from "next/image"

export default function ProductDashboard2() {
	const products = [
		{
			id: 1,
			image: "/placeholder.svg?height=400&width=400",
			title: "Mango",
			listingStatus: "PENDING",
			description:
				"Sweet and juicy Philippine mangoes, known for their vibrant flavor.",
			farmer: "Deal Farmer",
			price: "₱40.00",
			unit: "Kilogram",
			quantity: 100,
			location: "View in map",
			orders: 0,
			reviews: 0,
			createdAt: "November 15, 2024",
			updatedAt: "November 17, 2024"
		},
		{
			id: 2,
			image: "/placeholder.svg?height=400&width=400",
			title: "Banana (Lakatan)",
			listingStatus: "PENDING",
			description: "Ripe Lakatan bananas, perfect for snacks and smoothies.",
			farmer: "Kael Farmer",
			price: "₱40.00",
			unit: "Kilogram",
			quantity: 100,
			location: "View in map",
			orders: 0,
			reviews: 0,
			createdAt: "November 15, 2024",
			updatedAt: "November 15, 2024"
		}
	]

	return (
		<div className="container mx-auto space-y-4 p-4">
			<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h1 className="text-2xl font-bold">Products</h1>
					<p className="text-sm text-muted-foreground">
						Manage products from farmers
					</p>
				</div>
				<Button className="w-full bg-green-600 hover:bg-green-700 sm:w-auto">
					<Plus className="mr-2 h-4 w-4" />
					Add New Product
				</Button>
			</div>

			<div className="flex gap-2">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input placeholder="Search products..." className="pl-9" />
				</div>
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="outline" size="icon">
							<SlidersHorizontal className="h-4 w-4" />
						</Button>
					</SheetTrigger>
					<SheetContent>
						<SheetHeader>
							<SheetTitle>Filters</SheetTitle>
						</SheetHeader>
						<div className="mt-4 space-y-4">
							<Input placeholder="Filter by name..." />
							<Input placeholder="Filter by farmer..." />
						</div>
					</SheetContent>
				</Sheet>
			</div>

			<div className="space-y-4">
				{products.map((product) => (
					<Card key={product.id} className="overflow-hidden">
						<div className="relative aspect-video bg-gray-50">
							<Image
								src={product.image}
								alt={product.title}
								fill
								className="object-cover"
							/>
							<Badge className="absolute right-2 top-2 border-yellow-200 bg-yellow-100 text-yellow-800">
								{product.listingStatus}
							</Badge>
						</div>
						<CardHeader className="p-4">
							<div className="flex items-start justify-between">
								<div>
									<CardTitle className="text-lg font-semibold">
										{product.title}
									</CardTitle>
									<p className="text-sm text-muted-foreground">
										{product.farmer}
									</p>
								</div>
								<div className="text-right">
									<div className="text-lg font-bold">{product.price}</div>
									<div className="text-sm text-muted-foreground">
										per {product.unit}
									</div>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-4 p-4 pt-0">
							<p className="text-sm text-muted-foreground">
								{product.description}
							</p>

							<div className="grid grid-cols-3 gap-4 text-sm">
								<div>
									<div className="text-muted-foreground">Quantity</div>
									<div className="font-medium">{product.quantity}</div>
								</div>
								<div>
									<div className="text-muted-foreground">Orders</div>
									<div className="font-medium">{product.orders}</div>
								</div>
								<div>
									<div className="text-muted-foreground">Reviews</div>
									<div className="font-medium">{product.reviews}</div>
								</div>
							</div>

							<Dialog>
								<DialogTrigger asChild>
									<Button variant="outline" className="w-full">
										<MapPin className="mr-2 h-4 w-4" />
										View Location
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Pickup Location</DialogTitle>
									</DialogHeader>
									<div className="aspect-video rounded-lg bg-muted">
										{/* Map placeholder */}
										<div className="flex h-full w-full items-center justify-center text-muted-foreground">
											Map View
										</div>
									</div>
								</DialogContent>
							</Dialog>

							<div className="flex items-center justify-between border-t pt-2 text-sm text-muted-foreground">
								<div className="flex items-center gap-1">
									<Clock className="h-4 w-4" />
									<span>Created: {product.createdAt}</span>
								</div>
								<Button variant="ghost" size="sm" className="text-primary">
									Details
									<ChevronRight className="ml-1 h-4 w-4" />
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="flex items-center justify-between border-t pt-4">
				<div className="text-sm text-muted-foreground">
					Showing {products.length} products
				</div>
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
