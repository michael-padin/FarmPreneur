"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
	BarChart3,
	Home,
	Package,
	ShoppingCart,
	Bell,
	Search,
	Plus,
	Filter
} from "lucide-react"

const FarmerDashboardClient = () => {
	const [activeTab, setActiveTab] = useState("home")
	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
			<header className="sticky top-0 z-10 bg-background/80 p-4 shadow-sm backdrop-blur-md">
				<div className="container mx-auto flex items-center justify-between">
					<h1 className="bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-2xl font-bold text-transparent">
						Farm Dashboard
					</h1>
					<div className="flex items-center space-x-4">
						<Button variant="ghost" size="icon">
							<Bell className="h-5 w-5" />
						</Button>
						<Avatar>
							<AvatarImage src="/placeholder.svg" alt="Farmer John" />
							<AvatarFallback>FJ</AvatarFallback>
						</Avatar>
					</div>
				</div>
			</header>

			<main className="container mx-auto p-4 pb-24">
				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="space-y-8"
				>
					<TabsContent value="home" className="space-y-6">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							<Card className="bg-primary text-primary-foreground">
								<CardHeader>
									<CardTitle className="text-2xl">
										Welcome back, Farmer John!
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-lg">
										{"Here's an overview of your farmerDetails's performance"}.
									</p>
								</CardContent>
							</Card>
						</motion.div>
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{[
								{
									title: "Total Sales",
									icon: ShoppingCart,
									value: "$5,231.89",
									change: "+20.1% from last month"
								},
								{
									title: "Active Listings",
									icon: Package,
									value: "24",
									change: "+2 new listings this week"
								},
								{
									title: "Pending Orders",
									icon: ShoppingCart,
									value: "12",
									change: "3 require action"
								}
							].map((item, index) => (
								<motion.div
									key={item.title}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
								>
									<Card className="overflow-hidden">
										<CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted pb-2">
											<CardTitle className="text-sm font-medium">
												{item.title}
											</CardTitle>
											<item.icon className="h-4 w-4 text-muted-foreground" />
										</CardHeader>
										<CardContent className="pt-4">
											<div className="text-2xl font-bold">{item.value}</div>
											<p className="mt-1 text-xs text-muted-foreground">
												{item.change}
											</p>
										</CardContent>
									</Card>
								</motion.div>
							))}
						</div>
					</TabsContent>
					<TabsContent value="products" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-xl">Your Products</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="mb-4 flex items-center justify-between">
									<div className="relative">
										<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											placeholder="Search products"
											className="w-[250px] pl-8"
										/>
									</div>
									<Button>
										<Plus className="mr-2 h-4 w-4" /> Add New Product
									</Button>
								</div>
								<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
									{[
										{ name: "Organic Apples", price: "$2.99/lb", stock: 500 },
										{ name: "Fresh Eggs", price: "$4.50/dozen", stock: 200 },
										{ name: "Grass-fed Beef", price: "$8.99/lb", stock: 100 }
									].map((product, index) => (
										<Card key={index}>
											<CardContent className="p-4">
												<div className="relative mb-4 aspect-square overflow-hidden rounded-lg">
													<img
														src={`/placeholder.svg?height=200&width=200&text=${product.name}`}
														alt={product.name}
														className="h-full w-full object-cover"
													/>
												</div>
												<h3 className="mb-1 font-semibold">{product.name}</h3>
												<p className="mb-2 text-sm text-muted-foreground">
													{product.price}
												</p>
												<div className="flex items-center justify-between">
													<Badge variant="secondary">
														Stock: {product.stock}
													</Badge>
													<Button variant="outline" size="sm">
														Edit
													</Button>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="orders" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-xl">Recent Orders</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="mb-4 flex items-center justify-between">
									<div className="relative">
										<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											placeholder="Search orders"
											className="w-[250px] pl-8"
										/>
									</div>
									<Button variant="outline">
										<Filter className="mr-2 h-4 w-4" /> Filter
									</Button>
								</div>
								<div className="space-y-4">
									{[
										{
											id: "ORD001",
											customer: "Alice Brown",
											total: "$145.00",
											status: "Shipped"
										},
										{
											id: "ORD002",
											customer: "Bob Smith",
											total: "$89.50",
											status: "Processing"
										},
										{
											id: "ORD003",
											customer: "Charlie Davis",
											total: "$210.75",
											status: "Delivered"
										}
									].map((order, index) => (
										<Card key={index}>
											<CardContent className="flex items-center justify-between p-4">
												<div>
													<p className="font-semibold">{order.id}</p>
													<p className="text-sm text-muted-foreground">
														{order.customer}
													</p>
												</div>
												<div className="text-right">
													<p className="font-medium">{order.total}</p>
													<Badge
														variant={
															order.status === "Delivered"
																? "default"
																: order.status === "Shipped"
																	? "secondary"
																	: "outline"
														}
													>
														{order.status}
													</Badge>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="analytics" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-xl">Sales Analytics</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
										{[
											{
												title: "Total Revenue",
												value: "$12,345",
												change: "+8.1%"
											},
											{
												title: "Average Order Value",
												value: "$78.50",
												change: "+2.3%"
											},
											{
												title: "Orders This Month",
												value: "157",
												change: "+12.5%"
											},
											{
												title: "Top Selling Product",
												value: "Organic Apples",
												change: ""
											}
										].map((stat, index) => (
											<Card key={index}>
												<CardContent className="p-4">
													<p className="mb-1 text-sm font-medium text-muted-foreground">
														{stat.title}
													</p>
													<h4 className="text-2xl font-bold">{stat.value}</h4>
													{stat.change && (
														<p
															className={`text-xs ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}
														>
															{stat.change}
														</p>
													)}
												</CardContent>
											</Card>
										))}
									</div>
									<Card>
										<CardContent className="p-4">
											<h3 className="mb-4 font-semibold">
												Monthly Sales Trend
											</h3>
											<div className="flex h-[200px] items-end justify-between">
												{[40, 70, 55, 90, 60, 80].map((height, index) => (
													<div
														key={index}
														className="w-1/6 bg-primary"
														style={{ height: `${height}%` }}
													></div>
												))}
											</div>
											<div className="mt-2 flex justify-between text-sm text-muted-foreground">
												<span>Jan</span>
												<span>Feb</span>
												<span>Mar</span>
												<span>Apr</span>
												<span>May</span>
												<span>Jun</span>
											</div>
										</CardContent>
									</Card>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
					<nav className="fixed bottom-0 left-0 right-0 bg-background/80 shadow-lg backdrop-blur-md">
						<TabsList className="flex h-16 w-full items-center justify-around">
							{[
								{ value: "home", icon: Home, label: "Home" },
								{ value: "products", icon: Package, label: "Products" },
								{ value: "orders", icon: ShoppingCart, label: "Orders" },
								{ value: "analytics", icon: BarChart3, label: "Analytics" }
							].map((tab) => (
								<TabsTrigger
									key={tab.value}
									value={tab.value}
									onClick={() => setActiveTab(tab.value)}
									className="flex h-full w-full flex-col items-center space-y-1 pt-2"
								>
									<tab.icon className="h-5 w-5" />
									<span className="text-xs">{tab.label}</span>
								</TabsTrigger>
							))}
						</TabsList>
					</nav>
				</Tabs>
			</main>
		</div>
	)
}

export default FarmerDashboardClient
