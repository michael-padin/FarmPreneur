"use client"

import { useState } from "react"
import {
	Bell,
	ChevronDown,
	Layout,
	LogOut,
	Menu,
	Settings,
	ShoppingCart,
	Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"

export default function AdminDashboard() {
	const [sidebarOpen, setSidebarOpen] = useState(false)

	return (
		<div className="flex h-screen overflow-hidden">
			{/* Sidebar */}
			<aside
				className={`min-h-screen w-64 bg-gray-800 p-4 text-white ${
					sidebarOpen ? "block" : "hidden"
				} md:block`}
			>
				<nav>
					<ul className="space-y-2">
						<li>
							<a
								href="#"
								className="flex items-center space-x-2 rounded p-2 hover:bg-gray-700"
							>
								<Layout className="h-5 w-5" />
								<span>Dashboard</span>
							</a>
						</li>
						<li>
							<a
								href="#"
								className="flex items-center space-x-2 rounded p-2 hover:bg-gray-700"
							>
								<ShoppingCart className="h-5 w-5" />
								<span>Orders</span>
							</a>
						</li>
						<li>
							<a
								href="#"
								className="flex items-center space-x-2 rounded p-2 hover:bg-gray-700"
							>
								<Users className="h-5 w-5" />
								<span>Customers</span>
							</a>
						</li>
					</ul>
				</nav>
			</aside>

			{/* Main Content */}
			<div className="flex flex-1 flex-col overflow-hidden">
				{/* Header */}
				<header className="z-10 bg-white shadow-sm">
					<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
						<Button
							variant="ghost"
							size="icon"
							className="md:hidden"
							onClick={() => setSidebarOpen(!sidebarOpen)}
						>
							<Menu className="h-6 w-6" />
						</Button>
						<div className="flex-1 md:flex md:items-center md:gap-12">
							<Input
								type="search"
								placeholder="Search..."
								className="max-w-sm"
							/>
						</div>
						<div className="flex items-center gap-4">
							<Button variant="ghost" size="icon">
								<Bell className="h-5 w-5" />
							</Button>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" className="flex items-center gap-2">
										<img
											alt="Avatar"
											className="rounded-full"
											height="32"
											src="/placeholder.svg?height=32&width=32"
											style={{
												aspectRatio: "32/32",
												objectFit: "cover"
											}}
											width="32"
										/>
										<span className="hidden md:inline-block">John Doe</span>
										<ChevronDown className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>My Account</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<Settings className="mr-2 h-4 w-4" />
										<span>Settings</span>
									</DropdownMenuItem>
									<DropdownMenuItem>
										<LogOut className="mr-2 h-4 w-4" />
										<span>Log out</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</header>

				{/* Main Content */}
				<main className="flex-1 overflow-y-auto bg-gray-100 p-4">
					<div className="mx-auto max-w-7xl">
						<h1 className="mb-4 text-2xl font-semibold text-gray-900">
							Dashboard
						</h1>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total Revenue
									</CardTitle>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										className="h-4 w-4 text-muted-foreground"
									>
										<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
									</svg>
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
										Subscriptions
									</CardTitle>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										className="h-4 w-4 text-muted-foreground"
									>
										<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
										<circle cx="9" cy="7" r="4" />
										<path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
									</svg>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">+2350</div>
									<p className="text-xs text-muted-foreground">
										+180.1% from last month
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">Sales</CardTitle>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										className="h-4 w-4 text-muted-foreground"
									>
										<rect width="20" height="14" x="2" y="5" rx="2" />
										<path d="M2 10h20" />
									</svg>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">+12,234</div>
									<p className="text-xs text-muted-foreground">
										+19% from last month
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Active Now
									</CardTitle>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										className="h-4 w-4 text-muted-foreground"
									>
										<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
									</svg>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">+573</div>
									<p className="text-xs text-muted-foreground">
										+201 since last hour
									</p>
								</CardContent>
							</Card>
						</div>
						<div className="mt-6">
							<h2 className="mb-4 text-xl font-semibold text-gray-900">
								Recent Orders
							</h2>
							<Card>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[100px]">Order</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Last Order</TableHead>
											<TableHead className="text-right">Total</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										<TableRow>
											<TableCell className="font-medium">#3210</TableCell>
											<TableCell>
												<span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
													Paid
												</span>
											</TableCell>
											<TableCell>5 minutes ago</TableCell>
											<TableCell className="text-right">$150.00</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className="font-medium">#3209</TableCell>
											<TableCell>
												<span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
													Pending
												</span>
											</TableCell>
											<TableCell>20 minutes ago</TableCell>
											<TableCell className="text-right">$75.00</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className="font-medium">#3208</TableCell>
											<TableCell>
												<span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
													Paid
												</span>
											</TableCell>
											<TableCell>1 hour ago</TableCell>
											<TableCell className="text-right">$200.00</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className="font-medium">#3207</TableCell>
											<TableCell>
												<span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
													Cancelled
												</span>
											</TableCell>
											<TableCell>2 hours ago</TableCell>
											<TableCell className="text-right">$50.00</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className="font-medium">#3206</TableCell>
											<TableCell>
												<span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
													Paid
												</span>
											</TableCell>
											<TableCell>3 hours ago</TableCell>
											<TableCell className="text-right">$100.00</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</Card>
						</div>
					</div>
				</main>
			</div>
		</div>
	)
}
