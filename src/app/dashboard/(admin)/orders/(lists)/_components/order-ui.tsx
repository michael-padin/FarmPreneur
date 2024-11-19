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
import { MapPin, Package } from "lucide-react"

// Demo data
const demoOrders = [
	{
		id: "6571234567890",
		createdAt: "2024-11-18T08:30:00Z",
		updatedAt: "2024-11-18T08:30:00Z",
		quantityPurchased: 5,
		totalPrice: 25.99,
		status: "IN_PROGRESS",
		product: {
			title: "Organic Apples",
			unit: "kg",
			images: ["/api/placeholder/100/100"]
		},
		address: {
			region: "California",
			fullAddress: "123 Farmer's Market, CA"
		}
	},
	{
		id: "6571234567891",
		createdAt: "2024-11-17T15:45:00Z",
		updatedAt: "2024-11-17T15:45:00Z",
		quantityPurchased: 2,
		totalPrice: 45.5,
		status: "COMPLETED",
		product: {
			title: "Fresh Honey",
			unit: "jar",
			images: ["/api/placeholder/100/100"]
		},
		address: {
			region: "Vermont",
			fullAddress: "456 Bee Farm Lane, VT"
		}
	},
	{
		id: "6571234567892",
		createdAt: "2024-11-16T12:15:00Z",
		updatedAt: "2024-11-16T12:15:00Z",
		quantityPurchased: 3,
		totalPrice: 18.75,
		status: "PENDING",
		product: {
			title: "Farm Fresh Eggs",
			unit: "dozen",
			images: ["/api/placeholder/100/100"]
		},
		address: {
			region: "Texas",
			fullAddress: "789 Ranch Road, TX"
		}
	},
	{
		id: "6571234567893",
		createdAt: "2024-11-15T09:20:00Z",
		updatedAt: "2024-11-15T09:20:00Z",
		quantityPurchased: 1,
		totalPrice: 65.0,
		status: "CANCELLED",
		product: {
			title: "Artisanal Cheese Box",
			unit: "box",
			images: ["/api/placeholder/100/100"]
		},
		address: {
			region: "Wisconsin",
			fullAddress: "321 Dairy Way, WI"
		}
	},
	{
		id: "6571234567894",
		createdAt: "2024-11-14T16:50:00Z",
		updatedAt: "2024-11-14T16:50:00Z",
		quantityPurchased: 4,
		totalPrice: 32.0,
		status: "FAILED",
		product: {
			title: "Organic Vegetables Bundle",
			unit: "bundle",
			images: ["/api/placeholder/100/100"]
		},
		address: {
			region: "Oregon",
			fullAddress: "654 Garden Path, OR"
		}
	}
]

const OrderStatus = {
	PENDING: "pending",
	IN_PROGRESS: "in progress",
	COMPLETED: "completed",
	CANCELLED: "cancelled",
	FAILED: "failed"
}

const getStatusColor = (status: keyof typeof OrderStatus) => {
	const colors = {
		[OrderStatus.PENDING]: "bg-yellow-100 text-yellow-800",
		[OrderStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800",
		[OrderStatus.COMPLETED]: "bg-green-100 text-green-800",
		[OrderStatus.CANCELLED]: "bg-gray-100 text-gray-800",
		[OrderStatus.FAILED]: "bg-red-100 text-red-800"
	}
	return colors[status.toLowerCase()] || "bg-gray-100 text-gray-800"
}

const OrderTable = () => {
	return (
		<Card className="w-full">
			<CardContent className="p-0">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">Order ID</TableHead>
							<TableHead>Product</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Quantity</TableHead>
							<TableHead>Price</TableHead>
							<TableHead>Location</TableHead>
							<TableHead>Date</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{demoOrders.map((order) => (
							<TableRow key={order.id}>
								<TableCell className="font-medium">
									{order.id.slice(-6)}
								</TableCell>
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
											<span className="font-medium">{order.product.title}</span>
											<span className="text-sm text-gray-500">
												{order.product.unit && `${order.product.unit}`}
											</span>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<Badge
										variant="secondary"
										className={`${getStatusColor(order.status as keyof typeof OrderStatus)}`}
									>
										{order.status.toLowerCase().replace("_", " ")}
									</Badge>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-1">
										<Package className="h-4 w-4" />
										<span>{order.quantityPurchased}</span>
									</div>
								</TableCell>
								<TableCell>${order.totalPrice.toFixed(2)}</TableCell>
								<TableCell>
									<div className="flex items-center gap-1">
										<MapPin className="h-4 w-4" />
										<span className="text-sm">
											{order.address?.region || "N/A"}
										</span>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex flex-col">
										<span className="text-sm">
											{new Date(order.createdAt).toLocaleDateString()}
										</span>
										<span className="text-xs text-gray-500">
											{new Date(order.createdAt).toLocaleTimeString()}
										</span>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}

export default OrderTable
