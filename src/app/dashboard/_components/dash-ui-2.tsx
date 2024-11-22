"use client"

import { useState } from "react"
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell
} from "recharts"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
	CalendarIcon,
	DownloadIcon,
	RefreshCw,
	Users,
	ShoppingCart,
	Truck,
	Star
} from "lucide-react"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"

// Mock data (replace with actual database queries)
const userStats = {
	totalUsers: 1000,
	farmers: 200,
	customers: 800,
	newUsersThisWeek: 50
}

const productStats = {
	totalProducts: 500,
	activeListings: 450,
	pendingApproval: 30,
	categories: [
		{ name: "Fruits", count: 150 },
		{ name: "Vegetables", count: 200 },
		{ name: "Dairy", count: 100 },
		{ name: "Grains", count: 50 }
	]
}

const orderStats = {
	totalOrders: 1500,
	completedOrders: 1200,
	pendingOrders: 250,
	cancelledOrders: 50,
	averageOrderValue: 75.5
}

const farmerApplications = {
	total: 250,
	pending: 30,
	approved: 200,
	rejected: 20
}

const reviewStats = {
	totalReviews: 800,
	averageRating: 4.2,
	ratingDistribution: [
		{ rating: 5, count: 400 },
		{ rating: 4, count: 250 },
		{ rating: 3, count: 100 },
		{ rating: 2, count: 30 },
		{ rating: 1, count: 20 }
	]
}

const weeklyOrderData = [
	{ name: "Week 1", orders: 320 },
	{ name: "Week 2", orders: 350 },
	{ name: "Week 3", orders: 400 },
	{ name: "Week 4", orders: 450 }
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function DashUI2() {
	const [dateRange, setDateRange] = useState({
		from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
		to: new Date()
	})

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="mb-8 flex items-center justify-between">
				<h1 className="text-3xl font-bold text-gray-800">
					Farm-to-Table Enterprise Dashboard
				</h1>
				<div className="flex items-center space-x-4">
					{/* <DatePickerWithRange date={dateRange} setDate={setDateRange} /> */}
					<Button variant="outline" size="icon">
						<RefreshCw className="h-4 w-4" />
					</Button>
					<Button>
						<DownloadIcon className="mr-2 h-4 w-4" /> Export
					</Button>
				</div>
			</div>

			<div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Users</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{userStats.totalUsers}</div>
						<p className="text-xs text-muted-foreground">
							+{userStats.newUsersThisWeek} from last week
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Active Products
						</CardTitle>
						<ShoppingCart className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{productStats.activeListings}
						</div>
						<p className="text-xs text-muted-foreground">
							{productStats.pendingApproval} pending approval
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Orders</CardTitle>
						<Truck className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{orderStats.totalOrders}</div>
						<p className="text-xs text-muted-foreground">
							{orderStats.pendingOrders} pending
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Average Rating
						</CardTitle>
						<Star className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{reviewStats.averageRating.toFixed(1)}
						</div>
						<p className="text-xs text-muted-foreground">
							{reviewStats.totalReviews} total reviews
						</p>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue="overview" className="space-y-4">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="products">Products</TabsTrigger>
					<TabsTrigger value="orders">Orders</TabsTrigger>
					<TabsTrigger value="users">Users</TabsTrigger>
				</TabsList>
				<TabsContent value="overview" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
						<Card className="col-span-4">
							<CardHeader>
								<CardTitle>Weekly Order Trend</CardTitle>
							</CardHeader>
							<CardContent className="h-[300px]">
								<ResponsiveContainer width="100%" height="100%">
									<LineChart data={weeklyOrderData}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="name" />
										<YAxis />
										<Tooltip />
										<Legend />
										<Line type="monotone" dataKey="orders" stroke="#8884d8" />
									</LineChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
						<Card className="col-span-3">
							<CardHeader>
								<CardTitle>Product Categories</CardTitle>
							</CardHeader>
							<CardContent className="h-[300px]">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={productStats.categories}
											cx="50%"
											cy="50%"
											labelLine={false}
											outerRadius={80}
											fill="#8884d8"
											dataKey="count"
											label={({ name, percent }) =>
												`${name} ${(percent * 100).toFixed(0)}%`
											}
										>
											{productStats.categories.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={COLORS[index % COLORS.length]}
												/>
											))}
										</Pie>
										<Tooltip />
									</PieChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</div>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
						<Card className="col-span-4">
							<CardHeader>
								<CardTitle>Farmer Applications</CardTitle>
							</CardHeader>
							<CardContent className="h-[300px]">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={[farmerApplications]}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="name" />
										<YAxis />
										<Tooltip />
										<Legend />
										<Bar dataKey="pending" fill="#ffc658" />
										<Bar dataKey="approved" fill="#82ca9d" />
										<Bar dataKey="rejected" fill="#ff7300" />
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
						<Card className="col-span-3">
							<CardHeader>
								<CardTitle>Rating Distribution</CardTitle>
							</CardHeader>
							<CardContent className="h-[300px]">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart
										data={reviewStats.ratingDistribution}
										layout="vertical"
									>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis type="number" />
										<YAxis dataKey="rating" type="category" />
										<Tooltip />
										<Legend />
										<Bar dataKey="count" fill="#8884d8" />
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
				<TabsContent value="products" className="space-y-4">
					{/* Add product-specific content here */}
				</TabsContent>
				<TabsContent value="orders" className="space-y-4">
					{/* Add order-specific content here */}
				</TabsContent>
				<TabsContent value="users" className="space-y-4">
					{/* Add user-specific content here */}
				</TabsContent>
			</Tabs>
		</div>
	)
}
