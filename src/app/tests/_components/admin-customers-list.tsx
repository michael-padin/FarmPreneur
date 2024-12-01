import {
	Search,
	SlidersHorizontal,
	Mail,
	Phone,
	MapPin,
	ShoppingBag,
	Star,
	ShoppingCart,
	Heart,
	Clock,
	CheckCircle
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

export default function AdminCustomers() {
	// Mock data for demonstration
	const customers = [
		{
			name: "Alice Johnson",
			email: "alice@example.com",
			contact: "+1 234 567 8900",
			address: "123 Main St, City, Country",
			orders: 5,
			reviews: 3,
			cart: 2,
			wishlist: 4,
			createdAt: "2024-01-01",
			updatedAt: "2024-01-05",
			emailVerified: true
		},
		{
			name: "Bob Smith",
			email: "bob@example.com",
			contact: "+1 234 567 8901",
			address: "456 Oak St, City, Country",
			orders: 3,
			reviews: 2,
			cart: 1,
			wishlist: 2,
			createdAt: "2024-01-02",
			updatedAt: "2024-01-06",
			emailVerified: false
		}
	]

	return (
		<div className="container mx-auto space-y-4 p-4">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Customers</h1>
					<p className="text-sm text-muted-foreground">
						Manage customer accounts
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
							<Input placeholder="Filter by email..." />
						</div>
					</SheetContent>
				</Sheet>
			</div>

			<div className="relative">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input placeholder="Search customers..." className="pl-9" />
			</div>

			<div className="space-y-4">
				{customers.map((customer) => (
					<Card key={customer.email} className="overflow-hidden">
						<CardHeader className="border-b bg-muted/40 p-4">
							<div className="flex items-center justify-between">
								<CardTitle className="text-base font-medium">
									{customer.name}
								</CardTitle>
								<Badge
									variant={customer.emailVerified ? "default" : "secondary"}
								>
									{customer.emailVerified ? "Verified" : "Unverified"}
								</Badge>
							</div>
						</CardHeader>
						<CardContent className="p-0">
							<div className="space-y-3 p-4">
								<div className="flex items-center gap-2">
									<Mail className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">{customer.email}</span>
								</div>
								<div className="flex items-center gap-2">
									<Phone className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">{customer.contact}</span>
								</div>
								<div className="flex items-center gap-2">
									<MapPin className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">{customer.address}</span>
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
									<div className="grid grid-cols-2 gap-4 border-t bg-muted/20 p-4">
										<div className="flex items-center gap-2">
											<ShoppingBag className="h-4 w-4 text-muted-foreground" />
											<div className="text-sm">
												<p className="text-muted-foreground">Orders</p>
												<p className="font-medium">{customer.orders}</p>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<Star className="h-4 w-4 text-muted-foreground" />
											<div className="text-sm">
												<p className="text-muted-foreground">Reviews</p>
												<p className="font-medium">{customer.reviews}</p>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<ShoppingCart className="h-4 w-4 text-muted-foreground" />
											<div className="text-sm">
												<p className="text-muted-foreground">Cart Items</p>
												<p className="font-medium">{customer.cart}</p>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<Heart className="h-4 w-4 text-muted-foreground" />
											<div className="text-sm">
												<p className="text-muted-foreground">Wishlist</p>
												<p className="font-medium">{customer.wishlist}</p>
											</div>
										</div>
									</div>
									<div className="space-y-2 border-t bg-muted/20 p-4 text-sm">
										<div className="flex items-center gap-2">
											<Clock className="h-4 w-4 text-muted-foreground" />
											<span className="text-muted-foreground">Created:</span>
											<span>{customer.createdAt}</span>
										</div>
										<div className="flex items-center gap-2">
											<Clock className="h-4 w-4 text-muted-foreground" />
											<span className="text-muted-foreground">Updated:</span>
											<span>{customer.updatedAt}</span>
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
					Showing {customers.length} customers
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
