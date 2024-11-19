import React from "react"
import { format } from "date-fns"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	MoreHorizontal,
	ArrowUpDown,
	Download,
	MapPin,
	Phone,
	Calendar,
	Clock
} from "lucide-react"

const OrderTable = () => {
	const orders = [
		{
			id: "ord_123",
			createdAt: new Date(),
			pickupWindow: "2-4 PM",
			pickupDate: new Date(),
			product: {
				title: "Organic Tomatoes",
				images: [{ url: "/api/placeholder/100/100" }],
				unit: "kg"
			},
			quantityPurchased: 5,
			totalPrice: 25.5,
			status: "IN_PROGRESS",
			customer: {
				name: "John Doe",
				phone: "+1234567890"
			},
			farmer: {
				name: "Green Acres Farm"
			},
			pickupLocation: {
				fullAddress: "123 Farmer's Market, City",
				note: "Look for the green tent"
			}
		}
	]

	const getStatusColor = (status) => {
		const statusColors = {
			PENDING: "bg-yellow-100 text-yellow-800",
			IN_PROGRESS: "bg-blue-100 text-blue-800",
			COMPLETED: "bg-green-100 text-green-800",
			CANCELLED: "bg-red-100 text-red-800",
			FAILED: "bg-gray-100 text-gray-800"
		}
		return statusColors[status] || "bg-gray-100 text-gray-800"
	}

	return (
		<Card className="w-full">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
				<div>
					<CardTitle>Pickup Orders</CardTitle>
					<p className="mt-1 text-sm text-muted-foreground">
						Manage your marketplace pickup orders
					</p>
				</div>
				<div className="flex space-x-2">
					<Button variant="outline" size="sm">
						<Download className="mr-2 h-4 w-4" />
						Export
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[100px]">Order ID</TableHead>
								<TableHead className="hidden min-w-[150px] md:table-cell">
									Product
								</TableHead>
								<TableHead className="min-w-[120px]">
									<div className="flex items-center space-x-1">
										<span>Pickup Date</span>
										<ArrowUpDown className="h-4 w-4" />
									</div>
								</TableHead>
								<TableHead className="min-w-[100px]">Status</TableHead>
								<TableHead className="hidden min-w-[130px] lg:table-cell">
									Customer
								</TableHead>
								<TableHead className="hidden min-w-[150px] xl:table-cell">
									Pickup Location
								</TableHead>
								<TableHead className="min-w-[100px] text-right">
									Total
								</TableHead>
								<TableHead className="w-[50px]"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{orders.map((order) => (
								<TableRow key={order.id}>
									<TableCell className="font-medium">{order.id}</TableCell>
									<TableCell className="hidden md:table-cell">
										<div className="flex items-center space-x-2">
											<img
												src={order.product.images[0].url}
												alt={order.product.title}
												className="h-8 w-8 rounded-full object-cover"
											/>
											<div className="flex flex-col">
												<span>{order.product.title}</span>
												<span className="text-sm text-muted-foreground">
													{order.quantityPurchased} {order.product.unit}
												</span>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex flex-col">
											<div className="flex items-center space-x-1">
												<Calendar className="h-4 w-4" />
												<span>{format(order.pickupDate, "MMM dd")}</span>
											</div>
											<div className="flex items-center space-x-1 text-sm text-muted-foreground">
												<Clock className="h-3 w-3" />
												<span>{order.pickupWindow}</span>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<Badge className={getStatusColor(order.status)}>
											{order.status}
										</Badge>
									</TableCell>
									<TableCell className="hidden lg:table-cell">
										<div className="flex flex-col">
											<span>{order.customer.name}</span>
											<div className="flex items-center space-x-1 text-sm text-muted-foreground">
												<Phone className="h-3 w-3" />
												<span>{order.customer.phone}</span>
											</div>
										</div>
									</TableCell>
									<TableCell className="hidden xl:table-cell">
										<div className="flex flex-col">
											<div className="flex items-center space-x-1">
												<MapPin className="h-4 w-4" />
												<span>{order.pickupLocation.fullAddress}</span>
											</div>
											{order.pickupLocation.note && (
												<span className="text-sm text-muted-foreground">
													Note: {order.pickupLocation.note}
												</span>
											)}
										</div>
									</TableCell>
									<TableCell className="text-right">
										${order.totalPrice.toFixed(2)}
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" className="h-8 w-8 p-0">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Actions</DropdownMenuLabel>
												<DropdownMenuItem>View Details</DropdownMenuItem>
												<DropdownMenuItem>Update Status</DropdownMenuItem>
												<DropdownMenuItem>Contact Customer</DropdownMenuItem>
												<DropdownMenuItem>Contact Farmer</DropdownMenuItem>
												<DropdownMenuItem>View Location</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	)
}

export default OrderTable
