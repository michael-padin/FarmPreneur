"use client"
import React from "react"
import { format } from "date-fns"
import { useQueryState } from "nuqs"
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
	DropdownMenuTrigger,
	DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
	MoreHorizontal,
	ArrowUpDown,
	Download,
	MapPin,
	Phone,
	Calendar,
	Clock,
	Package,
	DollarSign,
	Search,
	Filter,
	X
} from "lucide-react"

const OrderUI6 = () => {
	// URL Query States
	const [search, setSearch] = useQueryState("search", { defaultValue: "" })
	const [status, setStatus] = useQueryState("status", { defaultValue: "all" })
	const [dateRange, setDateRange] = useQueryState("dateRange", {
		defaultValue: "7"
	}) // days
	const [sortBy, setSortBy] = useQueryState("sortBy", { defaultValue: "date" })
	const [sortOrder, setSortOrder] = useQueryState("sortOrder", {
		defaultValue: "desc"
	})

	// Sample data - in real app, this would be filtered based on query states
	const orders = [
		{
			id: "ord_123",
			createdAt: new Date(),
			pickupWindow: "2-4 PM",
			pickupDate: new Date(),
			product: {
				title: "Organic Tomatoes",
				images: [
					{
						url: "https://pub-c0b0612ac60c481aa03192161bd30b3f.r2.dev/product-images/0a5cfda8-42e0-462b-a01f-6d0ec0144283-carrots.jpg"
					}
				],
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

	const statusOptions = [
		{ label: "All", value: "all" },
		{ label: "Pending", value: "PENDING" },
		{ label: "In Progress", value: "IN_PROGRESS" },
		{ label: "Completed", value: "COMPLETED" },
		{ label: "Cancelled", value: "CANCELLED" }
	]

	const dateRangeOptions = [
		{ label: "Last 7 days", value: "7" },
		{ label: "Last 30 days", value: "30" },
		{ label: "Last 90 days", value: "90" }
	]

	const sortOptions = [
		{ label: "Pickup Date", value: "date" },
		{ label: "Order ID", value: "id" },
		{ label: "Total Price", value: "price" }
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

	// Filter components
	const FilterBar = () => (
		<div className="mb-4 space-y-4">
			<div className="flex flex-col gap-4 sm:flex-row">
				<div className="flex-1">
					<div className="relative">
						<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search orders..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-8"
						/>
						{search && (
							<Button
								variant="ghost"
								size="sm"
								className="absolute right-1 top-1.5 h-7 w-7 p-0"
								onClick={() => setSearch("")}
							>
								<X className="h-4 w-4" />
							</Button>
						)}
					</div>
				</div>
				<div className="flex flex-row gap-2">
					<Select value={status} onValueChange={setStatus}>
						<SelectTrigger className="w-[140px]">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							{statusOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select value={dateRange} onValueChange={setDateRange}>
						<SelectTrigger className="w-[140px]">
							<SelectValue placeholder="Date Range" />
						</SelectTrigger>
						<SelectContent>
							{dateRangeOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="icon">
								<Filter className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-[200px]">
							<DropdownMenuLabel>Sort By</DropdownMenuLabel>
							{sortOptions.map((option) => (
								<DropdownMenuCheckboxItem
									key={option.value}
									checked={sortBy === option.value}
									onCheckedChange={() => {
										setSortBy(option.value)
										setSortOrder(sortOrder === "asc" ? "desc" : "asc")
									}}
								>
									{option.label}
									{sortBy === option.value && (
										<ArrowUpDown className="ml-2 h-4 w-4" />
									)}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Active Filters */}
			{(search || status !== "all" || dateRange !== "7") && (
				<div className="flex flex-wrap gap-2">
					{search && (
						<Badge variant="secondary" className="flex items-center gap-1">
							Search: {search}
							<Button
								variant="ghost"
								size="sm"
								className="ml-1 h-4 w-4 p-0"
								onClick={() => setSearch("")}
							>
								<X className="h-3 w-3" />
							</Button>
						</Badge>
					)}
					{status !== "all" && (
						<Badge variant="secondary" className="flex items-center gap-1">
							Status: {statusOptions.find((o) => o.value === status)?.label}
							<Button
								variant="ghost"
								size="sm"
								className="ml-1 h-4 w-4 p-0"
								onClick={() => setStatus("all")}
							>
								<X className="h-3 w-3" />
							</Button>
						</Badge>
					)}
					{dateRange !== "7" && (
						<Badge variant="secondary" className="flex items-center gap-1">
							{dateRangeOptions.find((o) => o.value === dateRange)?.label}
							<Button
								variant="ghost"
								size="sm"
								className="ml-1 h-4 w-4 p-0"
								onClick={() => setDateRange("7")}
							>
								<X className="h-3 w-3" />
							</Button>
						</Badge>
					)}
					<Button
						variant="ghost"
						size="sm"
						onClick={() => {
							setSearch("")
							setStatus("all")
							setDateRange("7")
							setSortBy("date")
							setSortOrder("desc")
						}}
					>
						Clear all filters
					</Button>
				</div>
			)}
		</div>
	)

	// Mobile Card View Component
	const MobileOrderCard = ({ order }) => (
		<Card className="mb-4">
			<CardContent className="pt-4">
				<div className="mb-4 flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<img
							src={order.product.images[0].url}
							alt={order.product.title}
							className="h-12 w-12 rounded-lg object-cover"
						/>
						<div>
							<h3 className="font-medium">{order.product.title}</h3>
							<p className="text-sm text-muted-foreground">
								{order.quantityPurchased} {order.product.unit}
							</p>
						</div>
					</div>
					<Badge className={getStatusColor(order.status)}>{order.status}</Badge>
				</div>

				<div className="space-y-3">
					<div className="flex items-center space-x-2 text-sm">
						<Calendar className="h-4 w-4 text-muted-foreground" />
						<div className="flex flex-col">
							<span>{format(order.pickupDate, "MMM dd, yyyy")}</span>
							<span className="text-muted-foreground">
								{order.pickupWindow}
							</span>
						</div>
					</div>

					<div className="flex items-center space-x-2 text-sm">
						<MapPin className="h-4 w-4 text-muted-foreground" />
						<div className="flex flex-col">
							<span>{order.pickupLocation.fullAddress}</span>
							{order.pickupLocation.note && (
								<span className="text-muted-foreground">
									{order.pickupLocation.note}
								</span>
							)}
						</div>
					</div>

					<div className="flex items-center space-x-2 text-sm">
						<Phone className="h-4 w-4 text-muted-foreground" />
						<span>{order.customer.phone}</span>
					</div>

					<div className="flex items-center justify-between border-t pt-2">
						<div className="flex items-center space-x-1">
							<Package className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm font-medium">Order #{order.id}</span>
						</div>
						<div className="flex items-center space-x-1">
							<DollarSign className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm font-medium">
								${order.totalPrice.toFixed(2)}
							</span>
						</div>
					</div>

					<div className="flex justify-end space-x-2 pt-2">
						<Button variant="outline" size="sm">
							View Details
						</Button>
						<Button size="sm">Update Status</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)

	return (
		<div className="w-full">
			<Card>
				<CardHeader className="flex flex-col space-y-4">
					<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
						<div>
							<CardTitle>Pickup Orders</CardTitle>
							<p className="mt-1 text-sm text-muted-foreground">
								Manage your marketplace pickup orders
							</p>
						</div>
						<Button variant="outline" size="sm">
							<Download className="mr-2 h-4 w-4" />
							Export
						</Button>
					</div>
					<FilterBar />
				</CardHeader>
				<CardContent>
					{/* Mobile View */}
					<div className="block md:hidden">
						{orders.map((order) => (
							<MobileOrderCard key={order.id} order={order} />
						))}
					</div>

					{/* Desktop View */}
					<div className="hidden rounded-md border md:block">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[100px]">Order ID</TableHead>
									<TableHead className="min-w-[150px]">Product</TableHead>
									<TableHead
										className="min-w-[120px] cursor-pointer"
										onClick={() => {
											setSortBy("date")
											setSortOrder(sortOrder === "asc" ? "desc" : "asc")
										}}
									>
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
									<TableHead
										className="min-w-[100px] cursor-pointer text-right"
										onClick={() => {
											setSortBy("price")
											setSortOrder(sortOrder === "asc" ? "desc" : "asc")
										}}
									>
										<div className="flex items-center justify-end space-x-1">
											<span>Total</span>
											<ArrowUpDown className="h-4 w-4" />
										</div>
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
		</div>
	)
}

export default OrderUI6
