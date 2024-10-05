"use client"
import { useState } from "react"
import { ChevronDown, ChevronUp, Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OrderItem {
	name: string
	quantity: number
	price: string
}

interface Order {
	id: string
	buyer: string
	total: string
	status: string
	items: OrderItem[]
	date: string
	address: string
	phone: string
}

export default function Component() {
	const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

	const orders: Order[] = [
		{
			id: "1",
			buyer: "Maria Santos",
			total: "₱1,250",
			status: "Pending",
			date: "2023-06-15",
			address: "123 Sampaguita St., Quezon City, Metro Manila",
			phone: "+63 912 345 6789",
			items: [
				{ name: "Saging", quantity: 5, price: "₱250" },
				{ name: "Kalabasa", quantity: 2, price: "₱120" },
				{ name: "Mangga", quantity: 3, price: "₱120" }
			]
		},
		{
			id: "2",
			buyer: "Juan dela Cruz",
			total: "₱980",
			status: "Confirmed",
			date: "2023-06-14",
			address: "456 Ilang-Ilang Ave., Makati City, Metro Manila",
			phone: "+63 923 456 7890",
			items: [
				{ name: "Kamatis", quantity: 4, price: "₱120" },
				{ name: "Sili", quantity: 2, price: "₱40" },
				{ name: "Pinya", quantity: 1, price: "₱100" }
			]
		},
		{
			id: "3",
			buyer: "Ana Reyes",
			total: "₱1,500",
			status: "Shipped",
			date: "2023-06-13",
			address: "789 Dahlia St., Pasig City, Metro Manila",
			phone: "+63 934 567 8901",
			items: [
				{ name: "Pakwan", quantity: 1, price: "₱200" },
				{ name: "Sitaw", quantity: 3, price: "₱120" },
				{ name: "Kalamansi", quantity: 10, price: "₱100" }
			]
		}
	]

	const handleOrderClick = (order: Order) => {
		setSelectedOrder(order)
	}

	const handleBackToList = () => {
		setSelectedOrder(null)
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4">
			{selectedOrder ? (
				<Card className="bg-card text-card-foreground">
					<CardHeader className="flex flex-row items-center">
						<Button
							variant="ghost"
							size="icon"
							onClick={handleBackToList}
							className="mr-2"
						>
							<ArrowLeft className="h-4 w-4" />
						</Button>
						<CardTitle className="text-2xl font-bold text-primary">
							Order Details
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-semibold">{selectedOrder.buyer}</h2>
								<Badge
									variant={
										selectedOrder.status === "Pending"
											? "secondary"
											: selectedOrder.status === "Confirmed"
												? "default"
												: "outline"
									}
								>
									{selectedOrder.status}
								</Badge>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">
									Order #{selectedOrder.id}
								</p>
								<p className="text-sm text-muted-foreground">
									{selectedOrder.date}
								</p>
							</div>

							<div>
								<h3 className="mb-2 font-semibold">Items:</h3>
								<ul className="space-y-2">
									{selectedOrder.items.map((item, index) => (
										<li key={index} className="flex justify-between text-sm">
											<span>
												{item.name} x{item.quantity}
											</span>
											<span>{item.price}</span>
										</li>
									))}
								</ul>
							</div>
							<div className="flex items-center justify-between border-t border-border pt-4">
								<span className="font-semibold">Total:</span>
								<span className="text-lg font-bold">{selectedOrder.total}</span>
							</div>
						</div>
					</CardContent>
				</Card>
			) : (
				<>
					<h1 className="mb-4 text-2xl font-bold text-primary">Buyer Orders</h1>
					<div className="relative mb-4">
						<Input
							type="search"
							placeholder="Search orders..."
							className="pl-10"
						/>
						<Search
							className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground"
							size={20}
						/>
					</div>
					<div className="space-y-4">
						{orders.map((order) => (
							<div
								key={order.id}
								className="overflow-hidden rounded-lg bg-card text-card-foreground shadow-md"
							>
								<div className="flex items-center justify-between p-4">
									<div>
										<h2 className="text-lg font-semibold">{order.buyer}</h2>
										<p className="text-sm text-muted-foreground">
											Order #{order.id}
										</p>
									</div>
									<div className="text-right">
										<p className="text-lg font-bold">{order.total}</p>
										<Badge
											variant={
												order.status === "Pending"
													? "secondary"
													: order.status === "Confirmed"
														? "default"
														: "outline"
											}
										>
											{order.status}
										</Badge>
									</div>
								</div>
								<Button
									variant="ghost"
									className="flex w-full items-center justify-between border-t border-border px-4 py-2"
									onClick={() =>
										setExpandedOrder(
											expandedOrder === order.id ? null : order.id
										)
									}
								>
									{expandedOrder === order.id ? "Hide Details" : "Show Details"}
									{expandedOrder === order.id ? (
										<ChevronUp size={20} />
									) : (
										<ChevronDown size={20} />
									)}
								</Button>
								{expandedOrder === order.id && (
									<div className="border-t border-border bg-accent p-4">
										<h3 className="mb-2 font-semibold">Items:</h3>
										<ul className="space-y-2">
											{order.items.map((item, index) => (
												<li key={index} className="flex justify-between">
													<span>
														{item.name} x{item.quantity}
													</span>
													<span>{item.price}</span>
												</li>
											))}
										</ul>
										<Button
											variant="link"
											className="mt-4 p-0"
											onClick={() => handleOrderClick(order)}
										>
											View Full Details
										</Button>
									</div>
								)}
							</div>
						))}
					</div>
				</>
			)}
		</div>
	)
}
