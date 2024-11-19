import React from "react"
import {
	TableHead,
	TableRow,
	TableHeader,
	TableCell,
	TableBody,
	Table
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
	MapPin,
	Package,
	User,
	Phone,
	Clock,
	Truck,
	Calendar,
	DollarSign,
	AlertCircle
} from "lucide-react"

// Enhanced demo data with additional fields
const demoOrders = [
	{
		id: "6571234567890",
		createdAt: "2024-11-18T08:30:00Z",
		updatedAt: "2024-11-18T08:30:00Z",
		quantityPurchased: 5,
		totalPrice: 25.99,
		status: "IN_PROGRESS",
		estimatedDelivery: "2024-11-20T10:00:00Z",
		product: {
			title: "Organic Apples",
			unit: "kg",
			images: ["/api/placeholder/100/100"],
			farmer: {
				name: "Green Valley Farms",
				phone: "+1 (555) 123-4567"
			}
		},
		customer: {
			name: "John Doe",
			phone: "+1 (555) 987-6543",
			email: "john@example.com"
		},
		address: {
			region: "California",
			fullAddress: "123 Farmer's Market, CA"
		},
		payment: {
			method: "Credit Card",
			status: "PAID",
			transactionId: "txn_123456"
		},
		specialInstructions: "Please deliver in the morning",
		lastStatusUpdate: "2024-11-18T09:00:00Z",
		priority: "HIGH"
	}
]

const OrderStatus = {
	PENDING: "pending",
	IN_PROGRESS: "in progress",
	COMPLETED: "completed",
	CANCELLED: "cancelled",
	FAILED: "failed"
}

const getStatusColor = (status) => {
	const colors = {
		[OrderStatus.PENDING]: "bg-yellow-100 text-yellow-800",
		[OrderStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800",
		[OrderStatus.COMPLETED]: "bg-green-100 text-green-800",
		[OrderStatus.CANCELLED]: "bg-gray-100 text-gray-800",
		[OrderStatus.FAILED]: "bg-red-100 text-red-800"
	}
	return colors[status.toLowerCase()] || "bg-gray-100 text-gray-800"
}

const getPriorityColor = (priority) => {
	const colors = {
		HIGH: "bg-red-100 text-red-800",
		MEDIUM: "bg-yellow-100 text-yellow-800",
		LOW: "bg-green-100 text-green-800"
	}
	return colors[priority] || "bg-gray-100 text-gray-800"
}

const OrderTable2 = () => {
	return (
		<Card className="w-full">
			<CardContent className="p-0">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[100px]">Order ID</TableHead>
								<TableHead>Product</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Customer</TableHead>
								<TableHead>Farmer</TableHead>
								<TableHead>Payment</TableHead>
								<TableHead>Delivery</TableHead>
								<TableHead>Priority</TableHead>
								<TableHead>Timeline</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{demoOrders.map((order) => (
								<TableRow key={order.id}>
									<TableCell className="font-medium">
										{order.id.slice(-6)}
									</TableCell>

									{/* Product Column */}
									<TableCell>
										<div className="flex items-center gap-3">
											{order.product.images?.[0] && (
												<div className="h-12 w-12 overflow-hidden rounded-md">
													<img
														src={order.product.images[0]}
														alt={order.product.title}
														className="h-full w-full object-cover"
													/>
												</div>
											)}
											<div className="flex flex-col">
												<span className="font-medium">
													{order.product.title}
												</span>
												<div className="flex items-center gap-1 text-sm text-gray-500">
													<Package className="h-3 w-3" />
													<span>
														{order.quantityPurchased} {order.product.unit}
													</span>
													<DollarSign className="ml-2 h-3 w-3" />
													<span>${order.totalPrice.toFixed(2)}</span>
												</div>
											</div>
										</div>
									</TableCell>

									{/* Status Column */}
									<TableCell>
										<div className="flex flex-col gap-1">
											<Badge
												variant="secondary"
												className={`${getStatusColor(order.status)}`}
											>
												{order.status.toLowerCase().replace("_", " ")}
											</Badge>
											<span className="text-xs text-gray-500">
												Last updated:{" "}
												{new Date(order.lastStatusUpdate).toLocaleTimeString()}
											</span>
										</div>
									</TableCell>

									{/* Customer Column */}
									<TableCell>
										<div className="flex flex-col">
											<div className="flex items-center gap-1">
												<User className="h-4 w-4" />
												<span>{order.customer.name}</span>
											</div>
											<div className="flex items-center gap-1 text-sm text-gray-500">
												<Phone className="h-3 w-3" />
												<span>{order.customer.phone}</span>
											</div>
										</div>
									</TableCell>

									{/* Farmer Column */}
									<TableCell>
										<div className="flex flex-col">
											<span>{order.product.farmer.name}</span>
											<span className="text-sm text-gray-500">
												{order.product.farmer.phone}
											</span>
										</div>
									</TableCell>

									{/* Payment Column */}
									<TableCell>
										<div className="flex flex-col">
											<Badge variant="outline" className="mb-1">
												{order.payment.status}
											</Badge>
											<span className="text-xs text-gray-500">
												{order.payment.method}
											</span>
											<span className="text-xs text-gray-500">
												ID: {order.payment.transactionId}
											</span>
										</div>
									</TableCell>

									{/* Delivery Column */}
									<TableCell>
										<div className="flex flex-col gap-1">
											<div className="flex items-center gap-1">
												<MapPin className="h-4 w-4" />
												<span className="text-sm">{order.address.region}</span>
											</div>
											<div className="flex items-center gap-1 text-sm text-gray-500">
												<Truck className="h-3 w-3" />
												<span>
													{new Date(
														order.estimatedDelivery
													).toLocaleDateString()}
												</span>
											</div>
										</div>
									</TableCell>

									{/* Priority Column */}
									<TableCell>
										<Badge
											variant="secondary"
											className={`${getPriorityColor(order.priority)}`}
										>
											{order.priority}
										</Badge>
									</TableCell>

									{/* Timeline Column */}
									<TableCell>
										<div className="flex flex-col gap-1">
											<div className="flex items-center gap-1 text-xs">
												<Calendar className="h-3 w-3" />
												<span>
													Created:{" "}
													{new Date(order.createdAt).toLocaleDateString()}
												</span>
											</div>
											<div className="flex items-center gap-1 text-xs text-gray-500">
												<Clock className="h-3 w-3" />
												<span>
													Updated:{" "}
													{new Date(order.updatedAt).toLocaleDateString()}
												</span>
											</div>
										</div>
									</TableCell>

									{/* Actions Column */}
									<TableCell>
										<div className="flex flex-col gap-1">
											{order.specialInstructions && (
												<Badge
													variant="outline"
													className="flex items-center gap-1"
												>
													<AlertCircle className="h-3 w-3" />
													<span className="text-xs">Special Instructions</span>
												</Badge>
											)}
										</div>
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

export default OrderTable2
