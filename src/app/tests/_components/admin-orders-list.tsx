import { Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

export default function AdminOrders() {
	// Mock data for demonstration
	const orders = [
		{
			id: "ORD-001",
			date: "2024-01-01",
			product: "Organic Tomatoes",
			customer: "John Smith",
			farmer: "Green Acres Farm",
			totalPrice: "$45.99",
			status: "Processing"
		},
		{
			id: "ORD-002",
			date: "2024-01-02",
			product: "Fresh Lettuce",
			customer: "Jane Doe",
			farmer: "Sunny Valley",
			totalPrice: "$32.50",
			status: "Delivered"
		}
	]

	return (
		<div className="container mx-auto space-y-4 p-4">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Orders</h1>
					<p className="text-sm text-muted-foreground">
						Manage and track orders
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
							<div className="space-y-2">
								<label className="text-sm font-medium">Status</label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="processing">Processing</SelectItem>
										<SelectItem value="delivered">Delivered</SelectItem>
										<SelectItem value="cancelled">Cancelled</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Date Range</label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Select range" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="today">Today</SelectItem>
										<SelectItem value="week">This Week</SelectItem>
										<SelectItem value="month">This Month</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</div>

			<div className="relative">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input placeholder="Search orders..." className="pl-9" />
			</div>

			<div className="space-y-4">
				{orders.length > 0 ? (
					orders.map((order) => (
						<Card key={order.id} className="overflow-hidden">
							<CardHeader className="border-b bg-muted/40 p-4">
								<div className="flex items-center justify-between">
									<CardTitle className="text-base font-medium">
										{order.id}
									</CardTitle>
									<Badge
										variant={
											order.status === "Delivered" ? "default" : "secondary"
										}
									>
										{order.status}
									</Badge>
								</div>
							</CardHeader>
							<CardContent className="grid gap-3 p-4 text-sm">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Date</span>
									<span className="font-medium">{order.date}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Product</span>
									<span className="font-medium">{order.product}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Customer</span>
									<span className="font-medium">{order.customer}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Farmer</span>
									<span className="font-medium">{order.farmer}</span>
								</div>
								<div className="flex justify-between border-t pt-3">
									<span className="font-medium">Total Price</span>
									<span className="font-bold">{order.totalPrice}</span>
								</div>
							</CardContent>
						</Card>
					))
				) : (
					<Card className="p-6 text-center text-muted-foreground">
						No orders found
					</Card>
				)}
			</div>

			<div className="flex items-center justify-between border-t pt-4">
				<div className="text-sm text-muted-foreground">
					Showing {orders.length} orders
				</div>
				<Select defaultValue="10">
					<SelectTrigger className="w-[110px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="10">10 per page</SelectItem>
						<SelectItem value="20">20 per page</SelectItem>
						<SelectItem value="50">50 per page</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	)
}
