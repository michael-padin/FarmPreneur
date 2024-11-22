"use client"

import { useState } from "react"
import {
	Bar,
	BarChart,
	Line,
	LineChart,
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid
} from "recharts"
import {
	ArrowDown,
	ArrowUp,
	DollarSign,
	ShoppingCart,
	Users,
	Sprout,
	Star,
	TrendingUp,
	Truck,
	AlertTriangle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent
} from "@/components/ui/chart"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data
const revenueData = [
	{ name: "Jan", total: 15000 },
	{ name: "Feb", total: 23000 },
	{ name: "Mar", total: 32000 },
	{ name: "Apr", total: 28000 },
	{ name: "May", total: 36000 },
	{ name: "Jun", total: 42000 }
]

const orderData = [
	{ month: "January", orders: 120 },
	{ month: "February", orders: 180 },
	{ month: "March", orders: 250 },
	{ month: "April", orders: 200 },
	{ month: "May", orders: 300 },
	{ month: "June", orders: 350 }
]

const userTypeData = [
	{ name: "Farmers", value: 300 },
	{ name: "Customers", value: 700 }
]

const productCategoryData = [
	{ name: "Fruits", value: 350 },
	{ name: "Vegetables", value: 400 },
	{ name: "Dairy", value: 250 }
]

const topProducts = [
	{
		id: 1,
		title: "Organic Apples",
		category: "Fruits",
		sales: 2500,
		rating: 4.8
	},
	{ id: 2, title: "Fresh Milk", category: "Dairy", sales: 2200, rating: 4.7 },
	{
		id: 3,
		title: "Tomatoes",
		category: "Vegetables",
		sales: 2000,
		rating: 4.6
	},
	{
		id: 4,
		title: "Free-range Eggs",
		category: "Dairy",
		sales: 1800,
		rating: 4.9
	}
]

const topFarmers = [
	{
		id: 1,
		name: "John Doe",
		image: "/placeholder-user.jpg",
		products: 45,
		revenue: 15000
	},
	{
		id: 2,
		name: "Jane Smith",
		image: "/placeholder-user.jpg",
		products: 38,
		revenue: 12500
	},
	{
		id: 3,
		name: "Bob Johnson",
		image: "/placeholder-user.jpg",
		products: 32,
		revenue: 10800
	},
	{
		id: 4,
		name: "Alice Brown",
		image: "/placeholder-user.jpg",
		products: 28,
		revenue: 9500
	}
]

const recentOrders = [
	{
		id: "ORD001",
		customer: "Emma Wilson",
		product: "Organic Apples",
		date: "2023-06-15",
		amount: 75.5,
		status: "COMPLETED"
	},
	{
		id: "ORD002",
		customer: "Liam Garcia",
		product: "Fresh Milk",
		date: "2023-06-14",
		amount: 32.0,
		status: "IN_PROGRESS"
	},
	{
		id: "ORD003",
		customer: "Olivia Taylor",
		product: "Tomatoes",
		date: "2023-06-14",
		amount: 18.75,
		status: "COMPLETED"
	},
	{
		id: "ORD004",
		customer: "Noah Martinez",
		product: "Free-range Eggs",
		date: "2023-06-13",
		amount: 24.0,
		status: "IN_PROGRESS"
	},
	{
		id: "ORD005",
		customer: "Ava Johnson",
		product: "Organic Spinach",
		date: "2023-06-13",
		amount: 15.25,
		status: "PENDING"
	}
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function DashUI3() {
	const [activeTab, setActiveTab] = useState("overview")

	return (
		<div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
			<div className="flex items-center justify-between space-y-2">
				<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
				<div className="flex items-center space-x-2">
					<Button>Download Report</Button>
				</div>
			</div>
			<Tabs
				defaultValue="overview"
				value={activeTab}
				onValueChange={setActiveTab}
			>
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="analytics">Analytics</TabsTrigger>
					<TabsTrigger value="reports">Reports</TabsTrigger>
					<TabsTrigger value="notifications">Notifications</TabsTrigger>
				</TabsList>
				<TabsContent value="overview" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total Revenue
								</CardTitle>
								<DollarSign className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">$45,231.89</div>
								<p className="text-xs text-muted-foreground">
									+20.1% from last month
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total Orders
								</CardTitle>
								<ShoppingCart className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">2,350</div>
								<p className="text-xs text-muted-foreground">
									+15% from last month
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									New Customers
								</CardTitle>
								<Users className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">573</div>
								<p className="text-xs text-muted-foreground">
									+201 from last month
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Active Farmers
								</CardTitle>
								<Sprout className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">245</div>
								<p className="text-xs text-muted-foreground">
									+18 from last month
								</p>
							</CardContent>
						</Card>
					</div>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
						<Card className="col-span-4">
							<CardHeader>
								<CardTitle>Revenue Overview</CardTitle>
							</CardHeader>
							<CardContent className="pl-2">
								<ChartContainer
									config={{
										total: {
											label: "Total Revenue",
											color: "hsl(var(--chart-1))"
										}
									}}
									className="w-full"
								>
									<BarChart data={revenueData} accessibilityLayer>
										<CartesianGrid vertical={false} />

										<XAxis
											dataKey="name"
											tickLine={false}
											tickMargin={10}
											axisLine={false}
											tickFormatter={(value) => value.slice(0, 3)}
										/>
										{/* <YAxis
											stroke="#888888"
											fontSize={12}
											tickLine={false}
											axisLine={false}
											tickFormatter={(value) => `$${value}`}
										/> */}
										<ChartTooltip
											content={<ChartTooltipContent />}
											cursor={false}
										/>
										<Bar dataKey="total" fill="var(--color-total)" radius={8} />
									</BarChart>
								</ChartContainer>
							</CardContent>
						</Card>
						<Card className="col-span-3">
							<CardHeader>
								<CardTitle>Recent Orders</CardTitle>
								<CardDescription>
									You made 265 sales this month.
								</CardDescription>
							</CardHeader>
							<CardContent className="h-full">
								<ChartContainer
									config={{
										orders: {
											label: "Orders",
											color: "hsl(var(--chart-1))"
										}
									}}
								>
									<LineChart
										accessibilityLayer
										data={orderData}
										margin={{
											left: 12,
											right: 12
										}}
									>
										<CartesianGrid vertical={false} />
										<XAxis
											dataKey="month"
											tickLine={false}
											axisLine={false}
											tickMargin={8}
											tickFormatter={(value) => value.slice(0, 3)}
										/>
										<ChartTooltip
											cursor={false}
											content={<ChartTooltipContent hideLabel />}
										/>
										<Line
											dataKey="orders"
											type="natural"
											stroke="var(--color-orders)"
											strokeWidth={2}
											// dot={false}
										/>
									</LineChart>
								</ChartContainer>
							</CardContent>
							<CardFooter className="flex-col items-start gap-2 text-sm">
								<div className="flex gap-2 font-medium leading-none">
									Trending up by 5.2% this month{" "}
									<TrendingUp className="h-4 w-4" />
								</div>
								<div className="leading-none text-muted-foreground">
									Showing total visitors for the last 6 months
								</div>
							</CardFooter>
						</Card>
					</div>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
						<Card className="col-span-4">
							<CardHeader>
								<CardTitle>Top Products</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-8">
									{topProducts.map((product) => (
										<div className="flex items-center" key={product.id}>
											<div className="space-y-1">
												<p className="text-sm font-medium leading-none">
													{product.title}
												</p>
												<p className="text-sm text-muted-foreground">
													{product.category}
												</p>
											</div>
											<div className="ml-auto font-medium">
												{product.sales} sales
											</div>
											<div className="ml-4 flex items-center">
												<Star className="mr-1 h-4 w-4 text-muted-foreground" />
												<span>{product.rating}</span>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
						<Card className="col-span-3">
							<CardHeader>
								<CardTitle>User Distribution</CardTitle>
							</CardHeader>
							<CardContent className="pl-2">
								<ChartContainer
									config={{
										value: {
											label: "Users",
											color: "hsl(var(--chart-3))"
										}
									}}
								>
									<ResponsiveContainer width="100%" height="100%">
										<PieChart>
											<Pie
												data={userTypeData}
												cx="50%"
												cy="50%"
												labelLine={false}
												outerRadius={80}
												fill="#8884d8"
												dataKey="value"
											>
												{userTypeData.map((entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={COLORS[index % COLORS.length]}
													/>
												))}
											</Pie>
											<ChartTooltip content={<ChartTooltipContent />} />
										</PieChart>
									</ResponsiveContainer>
								</ChartContainer>
								<div className="mt-4 flex justify-center space-x-4">
									{userTypeData.map((entry, index) => (
										<div key={`legend-${index}`} className="flex items-center">
											<div
												className="mr-2 h-3 w-3"
												style={{
													backgroundColor: COLORS[index % COLORS.length]
												}}
											/>
											<span>{entry.name}</span>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
				<TabsContent value="analytics" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Average Order Value
								</CardTitle>
								<DollarSign className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">$42.50</div>
								<p className="text-xs text-muted-foreground">
									+8% from last month
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Customer Retention Rate
								</CardTitle>
								<Users className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">68%</div>
								<p className="text-xs text-muted-foreground">
									+5% from last quarter
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Product Categories
								</CardTitle>
								<Sprout className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">15</div>
								<p className="text-xs text-muted-foreground">
									+2 new categories
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
								<div className="text-2xl font-bold">4.7</div>
								<p className="text-xs text-muted-foreground">
									Based on 1,234 reviews
								</p>
							</CardContent>
						</Card>
					</div>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
						<Card className="col-span-4">
							<CardHeader>
								<CardTitle>Product Category Distribution</CardTitle>
							</CardHeader>
							<CardContent className="pl-2">
								<ChartContainer
									config={{
										value: {
											label: "Products",
											color: "hsl(var(--chart-4))"
										}
									}}
									className="h-[300px]"
								>
									<ResponsiveContainer width="100%" height="100%">
										<PieChart>
											<Pie
												data={productCategoryData}
												cx="50%"
												cy="50%"
												labelLine={false}
												outerRadius={100}
												fill="#8884d8"
												dataKey="value"
											>
												{productCategoryData.map((entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={COLORS[index % COLORS.length]}
													/>
												))}
											</Pie>
											<ChartTooltip content={<ChartTooltipContent />} />
										</PieChart>
									</ResponsiveContainer>
								</ChartContainer>
								<div className="mt-4 flex justify-center space-x-4">
									{productCategoryData.map((entry, index) => (
										<div key={`legend-${index}`} className="flex items-center">
											<div
												className="mr-2 h-3 w-3"
												style={{
													backgroundColor: COLORS[index % COLORS.length]
												}}
											/>
											<span>{entry.name}</span>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
						<Card className="col-span-3">
							<CardHeader>
								<CardTitle>Top Performing Farmers</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-8">
									{topFarmers.map((farmer) => (
										<div className="flex items-center" key={farmer.id}>
											<Avatar className="h-9 w-9">
												<AvatarImage src={farmer.image} alt={farmer.name} />
												<AvatarFallback>{farmer.name.charAt(0)}</AvatarFallback>
											</Avatar>
											<div className="ml-4 space-y-1">
												<p className="text-sm font-medium leading-none">
													{farmer.name}
												</p>
												<p className="text-sm text-muted-foreground">
													{farmer.products} products
												</p>
											</div>
											<div className="ml-auto font-medium">
												${farmer.revenue.toFixed(2)}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
				<TabsContent value="reports" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Recent Orders</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-[100px]">Order ID</TableHead>
										<TableHead>Customer</TableHead>
										<TableHead>Product</TableHead>
										<TableHead>Date</TableHead>
										<TableHead className="text-right">Amount</TableHead>
										<TableHead>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{recentOrders.map((order) => (
										<TableRow key={order.id}>
											<TableCell className="font-medium">{order.id}</TableCell>
											<TableCell>{order.customer}</TableCell>
											<TableCell>{order.product}</TableCell>
											<TableCell>{order.date}</TableCell>
											<TableCell className="text-right">
												${order.amount.toFixed(2)}
											</TableCell>
											<TableCell>
												<span
													className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
														order.status === "COMPLETED"
															? "bg-green-100 text-green-800"
															: order.status === "IN_PROGRESS"
																? "bg-yellow-100 text-yellow-800"
																: "bg-red-100 text-red-800"
													}`}
												>
													{order.status}
												</span>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="notifications" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Recent Notifications</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-8">
								<div className="flex items-center">
									<span className="relative mr-2 flex h-2 w-2">
										<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
										<span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
									</span>
									<div className="flex-1 space-y-1">
										<p className="text-sm font-medium leading-none">
											New order received
										</p>
										<p className="text-sm text-muted-foreground">
											Order #12345 from John Doe
										</p>
									</div>
									<div className="text-sm text-muted-foreground">5m ago</div>
								</div>
								<div className="flex items-center">
									<AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
									<div className="flex-1 space-y-1">
										<p className="text-sm font-medium leading-none">
											Low stock alert
										</p>
										<p className="text-sm text-muted-foreground">
											Organic Apples (5 units remaining)
										</p>
									</div>
									<div className="text-sm text-muted-foreground">1h ago</div>
								</div>
								<div className="flex items-center">
									<TrendingUp className="mr-2 h-4 w-4 text-green-500" />
									<div className="flex-1 space-y-1">
										<p className="text-sm font-medium leading-none">
											Sales milestone reached
										</p>
										<p className="text-sm text-muted-foreground">
											1000th order processed
										</p>
									</div>
									<div className="text-sm text-muted-foreground">1d ago</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
