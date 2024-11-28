"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DownloadIcon, RefreshCcw } from "lucide-react"
import { useState } from "react"
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from "recharts"
// import { DatePickerWithRange } from "@/components/ui/date-picker-with-range" // You'll need to create this component

// Mock data for analytics (replace with actual data from your API)
const userGrowth = [
	{ month: "Jan", farmers: 100, customers: 500 },
	{ month: "Feb", farmers: 120, customers: 550 },
	{ month: "Mar", farmers: 140, customers: 600 },
	{ month: "Apr", farmers: 160, customers: 650 },
	{ month: "May", farmers: 180, customers: 700 },
	{ month: "Jun", farmers: 200, customers: 750 }
]

const orderAnalytics = [
	{ month: "Jan", orders: 1000, revenue: 50000, avgOrderValue: 50 },
	{ month: "Feb", orders: 1200, revenue: 60000, avgOrderValue: 50 },
	{ month: "Mar", orders: 1100, revenue: 55000, avgOrderValue: 50 },
	{ month: "Apr", orders: 1300, revenue: 65000, avgOrderValue: 50 },
	{ month: "May", orders: 1400, revenue: 70000, avgOrderValue: 50 },
	{ month: "Jun", orders: 1500, revenue: 75000, avgOrderValue: 50 }
]

const productAnalytics = [
	{ category: "Fruits", sales: 1200, revenue: 60000, products: 50 },
	{ category: "Vegetables", sales: 1500, revenue: 75000, products: 70 },
	{ category: "Dairy", sales: 800, revenue: 40000, products: 30 },
	{ category: "Grains", sales: 1000, revenue: 50000, products: 40 },
	{ category: "Meat", sales: 700, revenue: 35000, products: 20 }
]

const farmerAnalytics = [
	{ status: "Pending", value: 50 },
	{ status: "Approved", value: 300 },
	{ status: "Rejected", value: 20 }
]

const orderStatusAnalytics = [
	{ status: "Pending", value: 100 },
	{ status: "In Progress", value: 150 },
	{ status: "Completed", value: 500 },
	{ status: "Cancelled", value: 50 }
]

const recentOrders = [
	{
		id: "1",
		product: "Organic Apples",
		customer: "John Doe",
		status: "Completed",
		amount: 25.99,
		date: "2023-06-01"
	},
	{
		id: "2",
		product: "Fresh Milk",
		customer: "Jane Smith",
		status: "Pending",
		amount: 15.5,
		date: "2023-06-02"
	},
	{
		id: "3",
		product: "Free-range Eggs",
		customer: "Bob Johnson",
		status: "In Progress",
		amount: 10.99,
		date: "2023-06-03"
	},
	{
		id: "4",
		product: "Grass-fed Beef",
		customer: "Alice Brown",
		status: "Completed",
		amount: 45.0,
		date: "2023-06-04"
	},
	{
		id: "5",
		product: "Organic Tomatoes",
		customer: "Charlie Davis",
		status: "Cancelled",
		amount: 8.75,
		date: "2023-06-05"
	}
]

const COLORS = [
	"hsl(var(--primary))",
	"hsl(var(--secondary))",
	"hsl(var(--accent))",
	"hsl(var(--muted))"
]

export function DashUI() {
	const [timeRange, setTimeRange] = useState("6m")

	return (
		<div className="">
			<div className="space-y-8 bg-background p-4 text-foreground sm:p-6 md:p-8">
				<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
					<h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
					<div className="flex flex-col gap-2 sm:flex-row">
						{/* <DatePickerWithRange /> */}
						<Select value={timeRange} onValueChange={setTimeRange}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Select time range" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="1m">Last Month</SelectItem>
								<SelectItem value="3m">Last 3 Months</SelectItem>
								<SelectItem value="6m">Last 6 Months</SelectItem>
								<SelectItem value="1y">Last Year</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<Tabs defaultValue="overview" className="space-y-4">
					<ScrollArea className="s w-full whitespace-nowrap rounded-md">
						<TabsList className="inline-flex h-10 w-max items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
							<TabsTrigger value="overview">Overview</TabsTrigger>
							<TabsTrigger value="users">Users</TabsTrigger>
							<TabsTrigger value="orders">Orders</TabsTrigger>
							<TabsTrigger value="products">Products</TabsTrigger>
							<TabsTrigger value="farmers">Farmers</TabsTrigger>
						</TabsList>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
					<TabsContent value="overview" className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total Users
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">1,250</div>
									<p className="text-xs text-muted-foreground">
										+15.1% from last month
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total Orders
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">5,680</div>
									<p className="text-xs text-muted-foreground">
										+8.2% from last month
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total Revenue
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">$284,000</div>
									<p className="text-xs text-muted-foreground">
										+12.3% from last month
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Avg. Order Value
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">$50</div>
									<p className="text-xs text-muted-foreground">
										+3.1% from last month
									</p>
								</CardContent>
							</Card>
						</div>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between">
								<CardTitle>Revenue Overview</CardTitle>
								<Button variant="outline" size="sm">
									<DownloadIcon className="mr-2 h-4 w-4" />
									Download Report
								</Button>
							</CardHeader>
							<CardContent>
								<div className="h-[300px] sm:h-[400px]">
									<ResponsiveContainer width="100%" height="100%">
										<LineChart data={orderAnalytics}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="month" />
											<YAxis yAxisId="left" />
											<YAxis yAxisId="right" orientation="right" />
											<Tooltip />
											<Legend />
											<Line
												yAxisId="left"
												type="monotone"
												dataKey="orders"
												stroke="hsl(var(--chart-1))"
											/>
											<Line
												yAxisId="right"
												type="monotone"
												dataKey="revenue"
												stroke="hsl(var(--chart-2))"
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="users" className="space-y-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between">
								<CardTitle>User Growth</CardTitle>
								<Button variant="outline" size="sm">
									<RefreshCcw className="mr-2 h-4 w-4" />
									Refresh Data
								</Button>
							</CardHeader>
							<CardContent>
								<div className="h-[300px] sm:h-[400px]">
									<ResponsiveContainer width="100%" height="100%">
										<LineChart data={userGrowth}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="month" />
											<YAxis />
											<Tooltip />
											<Legend />
											<Line
												type="monotone"
												dataKey="farmers"
												stroke="hsl(var(--chart-1))"
											/>
											<Line
												type="monotone"
												dataKey="customers"
												stroke="hsl(var(--chart-2))"
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="orders" className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<Card>
								<CardHeader>
									<CardTitle>Order Trends</CardTitle>
									<CardDescription>
										Monthly order count, revenue, and average order value
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="h-[300px]">
										<ResponsiveContainer width="100%" height="100%">
											<LineChart data={orderAnalytics}>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="month" />
												<YAxis yAxisId="left" />
												<YAxis yAxisId="right" orientation="right" />
												<Tooltip />
												<Legend />
												<Line
													yAxisId="left"
													type="monotone"
													dataKey="orders"
													stroke="hsl(var(--primary))"
												/>
												<Line
													yAxisId="right"
													type="monotone"
													dataKey="revenue"
													stroke="hsl(var(--secondary))"
												/>
												<Line
													yAxisId="left"
													type="monotone"
													dataKey="avgOrderValue"
													stroke="hsl(var(--accent))"
												/>
											</LineChart>
										</ResponsiveContainer>
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Order Status Distribution</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="h-[300px]">
										<ResponsiveContainer width="100%" height="100%">
											<PieChart>
												<Pie
													data={orderStatusAnalytics}
													cx="50%"
													cy="50%"
													labelLine={false}
													outerRadius={80}
													fill="#8884d8"
													dataKey="value"
													label={({ name, percent }) =>
														`${name} ${(percent * 100).toFixed(0)}%`
													}
												>
													{orderStatusAnalytics.map((entry, index) => (
														<Cell
															key={`cell-${index}`}
															fill={COLORS[index % COLORS.length]}
														/>
													))}
												</Pie>
												<Tooltip />
												<Legend />
											</PieChart>
										</ResponsiveContainer>
									</div>
								</CardContent>
							</Card>
						</div>
						<Card>
							<CardHeader>
								<CardTitle>Recent Orders</CardTitle>
								<CardDescription>Latest orders in the system</CardDescription>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Order ID</TableHead>
											<TableHead>Product</TableHead>
											<TableHead>Customer</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Amount</TableHead>
											<TableHead>Date</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{recentOrders.map((order) => (
											<TableRow key={order.id}>
												<TableCell>{order.id}</TableCell>
												<TableCell>{order.product}</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<Avatar className="h-8 w-8">
															<AvatarImage
																src={`https://api.dicebear.com/6.x/initials/svg?seed=${order.customer}`}
																alt={order.customer}
															/>
															<AvatarFallback>
																{order.customer
																	.split(" ")
																	.map((n) => n[0])
																	.join("")}
															</AvatarFallback>
														</Avatar>
														{order.customer}
													</div>
												</TableCell>
												<TableCell>
													<Badge
														variant={
															order.status === "Completed"
																? "default"
																: order.status === "Pending"
																	? "destructive"
																	: order.status === "In Progress"
																		? "outline"
																		: "destructive"
														}
													>
														{order.status}
													</Badge>
												</TableCell>
												<TableCell>${order.amount.toFixed(2)}</TableCell>
												<TableCell>{order.date}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="products" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Product Category Performance</CardTitle>
								<CardDescription>
									Sales, revenue, and product count by category
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="h-[300px] sm:h-[400px]">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart data={productAnalytics}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="category" />
											<YAxis yAxisId="left" />
											<YAxis yAxisId="right" orientation="right" />
											<Tooltip />
											<Legend />
											<Bar
												yAxisId="left"
												dataKey="sales"
												fill="hsl(var(--primary))"
											/>
											<Bar
												yAxisId="right"
												dataKey="revenue"
												fill="hsl(var(--secondary))"
											/>
											<Bar
												yAxisId="left"
												dataKey="products"
												fill="hsl(var(--accent))"
											/>
										</BarChart>
									</ResponsiveContainer>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="farmers" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Farmer Application Status</CardTitle>
								<CardDescription>
									Distribution of farmer application statuses
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="h-[300px] sm:h-[400px]">
									<ResponsiveContainer width="100%" height="100%">
										<PieChart>
											<Pie
												data={farmerAnalytics}
												cx="50%"
												cy="50%"
												labelLine={false}
												outerRadius={80}
												fill="#8884d8"
												dataKey="value"
												label={({ name, percent }) =>
													`${name} ${(percent * 100).toFixed(0)}%`
												}
											>
												{farmerAnalytics.map((entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={COLORS[index % COLORS.length]}
													/>
												))}
											</Pie>
											<Tooltip />
											<Legend />
										</PieChart>
									</ResponsiveContainer>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}
