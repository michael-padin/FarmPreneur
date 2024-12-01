import {
	Search,
	SlidersHorizontal,
	Mail,
	Phone,
	MapPin,
	Package,
	Store,
	Star,
	CheckCircle,
	Clock,
	MoreVertical
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
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export default function AdminFarmers() {
	const farmers = [
		{
			name: "Michael Farmer",
			email: "farmer@gmail.com",
			contact: "+639",
			address: "123 Farm Road, Agricultural District",
			orders: 0,
			products: 0,
			reviews: 0,
			applicationStatus: "PENDING",
			verified: true,
			createdAt: "December 1, 2024",
			updatedAt: "December 1, 2024"
		},
		{
			name: "Kael Mock",
			email: "kaelmock@gmail.com",
			contact: "+639955143588",
			address: "456 Harvest Lane, Rural Area",
			orders: 0,
			products: 0,
			reviews: 0,
			applicationStatus: "APPROVED",
			verified: true,
			createdAt: "December 1, 2024",
			updatedAt: "December 1, 2024"
		}
	]

	return (
		<div className="container mx-auto space-y-4 p-4">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Farmers</h1>
					<p className="text-sm text-muted-foreground">
						Manage farmers account
					</p>
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
							<Input placeholder="Filter by status..." />
						</div>
					</SheetContent>
				</Sheet>
			</div>

			<div className="relative">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input placeholder="Search farmers..." className="pl-9" />
			</div>

			<div className="space-y-4">
				{farmers.map((farmer) => (
					<Card key={farmer.email} className="overflow-hidden">
						<CardHeader className="border-b bg-muted/40 p-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<CardTitle className="text-base font-medium">
										{farmer.name}
									</CardTitle>
									{farmer.verified && (
										<CheckCircle className="h-4 w-4 text-green-500" />
									)}
								</div>
								<div className="flex items-center gap-2">
									<Badge
										variant={
											farmer.applicationStatus === "APPROVED"
												? "default"
												: "secondary"
										}
									>
										{farmer.applicationStatus}
									</Badge>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon">
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem>View Details</DropdownMenuItem>
											<DropdownMenuItem>Edit Profile</DropdownMenuItem>
											<DropdownMenuItem className="text-destructive">
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
						</CardHeader>
						<CardContent className="p-0">
							<div className="space-y-3 p-4">
								<div className="flex items-center gap-2">
									<Mail className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">{farmer.email}</span>
								</div>
								<div className="flex items-center gap-2">
									<Phone className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">{farmer.contact}</span>
								</div>
								<div className="flex items-center gap-2">
									<MapPin className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">{farmer.address}</span>
								</div>
							</div>

							<Collapsible>
								<CollapsibleTrigger className="flex w-full items-center justify-between border-t p-4 hover:bg-muted/50">
									<span className="text-sm font-medium">Activity Summary</span>
									<Button variant="ghost" size="sm">
										View Details
									</Button>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<div className="grid grid-cols-3 gap-4 border-t bg-muted/20 p-4">
										<div className="flex items-center gap-2">
											<Package className="h-4 w-4 text-muted-foreground" />
											<div className="text-sm">
												<p className="text-muted-foreground">Orders</p>
												<p className="font-medium">{farmer.orders}</p>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<Store className="h-4 w-4 text-muted-foreground" />
											<div className="text-sm">
												<p className="text-muted-foreground">Products</p>
												<p className="font-medium">{farmer.products}</p>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<Star className="h-4 w-4 text-muted-foreground" />
											<div className="text-sm">
												<p className="text-muted-foreground">Reviews</p>
												<p className="font-medium">{farmer.reviews}</p>
											</div>
										</div>
									</div>
									<div className="space-y-2 border-t bg-muted/20 p-4 text-sm">
										<div className="flex items-center gap-2">
											<Clock className="h-4 w-4 text-muted-foreground" />
											<span className="text-muted-foreground">Created:</span>
											<span>{farmer.createdAt}</span>
										</div>
										<div className="flex items-center gap-2">
											<Clock className="h-4 w-4 text-muted-foreground" />
											<span className="text-muted-foreground">Updated:</span>
											<span>{farmer.updatedAt}</span>
										</div>
									</div>
								</CollapsibleContent>
							</Collapsible>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="flex items-center justify-between border-t pt-4">
				<div className="text-sm text-muted-foreground">
					Showing {farmers.length} farmers
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
