"use client"
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
	Calendar,
	MoreVertical,
	Eye,
	Edit,
	Trash2
} from "lucide-react"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

// Demo data adjusted for cash on pickup
const demoOrders = [
	{
		id: "6571234567890",
		createdAt: "2024-11-18T08:30:00Z",
		updatedAt: "2024-11-18T08:30:00Z",
		quantityPurchased: 5,
		totalPrice: 25.99,
		status: "IN_PROGRESS",
		pickupWindow: "9 AM - 5 PM",
		product: {
			title: "Organic Apples",
			unit: "kg",
			images: [
				"https://pub-c0b0612ac60c481aa03192161bd30b3f.r2.dev/product-images/0a5cfda8-42e0-462b-a01f-6d0ec0144283-carrots.jpg"
			],
			farmer: {
				name: "Green Valley Farms",
				phone: "+1 (555) 123-4567"
			}
		},
		customer: {
			name: "John Doe",
			phone: "+1 (555) 987-6543"
		},
		pickupLocation: {
			fullAddress: "123 Farmer's Market, Green Valley, CA 94123",
			region: "California",
			note: "Enter through the south gate"
		}
	},
	{
		id: "6571234567891",
		createdAt: "2024-11-17T15:45:00Z",
		updatedAt: "2024-11-17T15:45:00Z",
		quantityPurchased: 2,
		totalPrice: 45.5,
		status: "PENDING",
		pickupWindow: "10 AM - 3 PM",
		product: {
			title: "Fresh Honey",
			unit: "jar",
			images: ["/api/placeholder/100/100"],
			farmer: {
				name: "Sweet Bee Farm",
				phone: "+1 (555) 234-5678"
			}
		},
		customer: {
			name: "Jane Smith",
			phone: "+1 (555) 876-5432"
		},
		pickupLocation: {
			fullAddress: "456 Farm Road, Sweet Valley, CA 94124",
			region: "California",
			note: "Park in designated areas only"
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

const ActionsDropdown = ({ onView, onEdit, onDelete }) => (
	<DropdownMenu>
		<DropdownMenuTrigger asChild>
			<Button variant="ghost" className="h-8 w-8 p-0">
				<MoreVertical className="h-4 w-4" />
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent align="end">
			<DropdownMenuItem onClick={onView} className="flex items-center gap-2">
				<Eye className="h-4 w-4" />
				<span>View Details</span>
			</DropdownMenuItem>
			<DropdownMenuItem onClick={onEdit} className="flex items-center gap-2">
				<Edit className="h-4 w-4" />
				<span>Edit Order</span>
			</DropdownMenuItem>
			<DropdownMenuItem
				onClick={onDelete}
				className="flex items-center gap-2 text-red-600 focus:text-red-600"
			>
				<Trash2 className="h-4 w-4" />
				<span>Delete Order</span>
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
)

// Desktop Table Component
const DesktopOrderTable = ({ orders }) => (
	<div className="hidden md:block">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[100px]">Order ID</TableHead>
					<TableHead>Product</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Customer</TableHead>
					<TableHead>Pickup Details</TableHead>
					<TableHead>Price</TableHead>
					<TableHead>Date</TableHead>
					<TableHead className="w-[70px]">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{orders.map((order) => (
					<TableRow key={order.id}>
						<TableCell className="font-medium">{order.id.slice(-6)}</TableCell>

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
									<div className="flex items-center gap-1 text-sm text-gray-500">
										<Package className="h-3 w-3" />
										<span>
											{order.quantityPurchased} {order.product.unit}
										</span>
									</div>
								</div>
							</div>
						</TableCell>

						<TableCell>
							<Badge
								variant="secondary"
								className={`${getStatusColor(order.status)}`}
							>
								{order.status.toLowerCase().replace("_", " ")}
							</Badge>
						</TableCell>

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

						<TableCell>
							<div className="flex flex-col gap-1">
								<div className="flex items-center gap-1">
									<MapPin className="h-4 w-4" />
									<span className="text-sm">{order.pickupLocation.region}</span>
								</div>
								<span className="text-xs text-gray-500">
									Window: {order.pickupWindow}
								</span>
							</div>
						</TableCell>

						<TableCell>
							<div className="font-medium">${order.totalPrice.toFixed(2)}</div>
							<div className="text-xs text-gray-500">Cash on pickup</div>
						</TableCell>

						<TableCell>
							<div className="flex flex-col text-sm">
								<span>{new Date(order.createdAt).toLocaleDateString()}</span>
								<span className="text-gray-500">
									{new Date(order.createdAt).toLocaleTimeString()}
								</span>
							</div>
						</TableCell>

						<TableCell>
							<ActionsDropdown
								onView={() => console.log("View order:", order.id)}
								onEdit={() => console.log("Edit order:", order.id)}
								onDelete={() => console.log("Delete order:", order.id)}
							/>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	</div>
)

// Mobile Card Component
const MobileOrderCard = ({ order }) => (
	<Card className="mb-4">
		<CardContent className="p-4">
			<div className="mb-4 flex items-center justify-between">
				<div className="flex flex-col">
					<span className="text-sm text-gray-500">
						Order #{order.id.slice(-6)}
					</span>
					<Badge
						variant="secondary"
						className={`${getStatusColor(order.status)} mt-1`}
					>
						{order.status.toLowerCase().replace("_", " ")}
					</Badge>
				</div>
				<div className="text-right">
					<div className="font-medium">${order.totalPrice.toFixed(2)}</div>
					<div className="text-xs text-gray-500">Cash on pickup</div>
				</div>
			</div>

			<div className="mb-4 flex gap-3">
				{order.product.images?.[0] && (
					<div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
						<img
							src={order.product.images[0]}
							alt={order.product.title}
							className="h-full w-full object-cover"
						/>
					</div>
				)}
				<div className="flex flex-col">
					<span className="font-medium">{order.product.title}</span>
					<div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
						<Package className="h-3 w-3" />
						<span>
							{order.quantityPurchased} {order.product.unit}
						</span>
					</div>
					<div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
						<Clock className="h-3 w-3" />
						<span>{order.pickupWindow}</span>
					</div>
				</div>
			</div>

			<div className="border-t pt-3">
				<div className="mb-2 flex items-start gap-2">
					<MapPin className="mt-1 h-4 w-4 text-gray-500" />
					<div className="flex-1">
						<div className="text-sm font-medium">Pickup Location</div>
						<div className="text-sm text-gray-600">
							{order.pickupLocation.fullAddress}
						</div>
						{order.pickupLocation.note && (
							<div className="mt-1 text-xs text-gray-500">
								{order.pickupLocation.note}
							</div>
						)}
					</div>
				</div>

				<div className="flex items-start gap-2">
					<User className="mt-1 h-4 w-4 text-gray-500" />
					<div className="flex-1">
						<div className="text-sm font-medium">{order.customer.name}</div>
						<div className="text-sm text-gray-600">{order.customer.phone}</div>
					</div>
				</div>
			</div>

			<div className="mt-4 flex gap-2">
				<Button
					variant="outline"
					className="flex-1"
					size="sm"
					onClick={() => console.log("View order:", order.id)}
				>
					<Eye className="mr-2 h-4 w-4" />
					View
				</Button>
				<Button
					variant="outline"
					className="flex-1"
					size="sm"
					onClick={() => console.log("Edit order:", order.id)}
				>
					<Edit className="mr-2 h-4 w-4" />
					Edit
				</Button>
				<Button
					variant="outline"
					className="flex-1 text-red-600 hover:text-red-600"
					size="sm"
					onClick={() => console.log("Delete order:", order.id)}
				>
					<Trash2 className="mr-2 h-4 w-4" />
					Delete
				</Button>
			</div>
		</CardContent>
	</Card>
)

// Main Component
const OrderUI4 = () => {
	return (
		<div>
			{/* Desktop View */}
			<DesktopOrderTable orders={demoOrders} />

			{/* Mobile View */}
			<div className="space-y-4 md:hidden">
				{demoOrders.map((order) => (
					<MobileOrderCard key={order.id} order={order} />
				))}
			</div>
		</div>
	)
}

export default OrderUI4
