"use client"
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/UJOwhEmIhKQ
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { ResponsiveLine } from "@nivo/line"
import Link from "next/link"

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

export default function FarmerDashboard() {
	return (
		<div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
			<div className="hidden border-r bg-gray-100/40 dark:bg-gray-800/40 lg:block">
				<div className="flex h-full max-h-screen flex-col gap-2">
					<div className="flex h-[80px] items-center border-b px-6">
						<Link className="flex items-center gap-2 font-semibold" href="#">
							<LeafIcon className="h-6 w-6" />
							<span className="">Farm2go</span>
						</Link>
						<Button className="ml-auto h-8 w-8" size="icon" variant="outline">
							<BellIcon className="h-4 w-4" />
							<span className="sr-only">Toggle notifications</span>
						</Button>
					</div>
					<div className="flex-1 overflow-auto py-2">
						<nav className="grid items-start px-4 text-sm font-medium">
							<Link
								className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
								href="#"
							>
								<HomeIcon className="h-4 w-4" />
								Dashboard
							</Link>
							<Link
								className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
								href="#"
							>
								<PackageIcon className="h-4 w-4" />
								Products
							</Link>
							<Link
								className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
								href="#"
							>
								<ShoppingCartIcon className="h-4 w-4" />
								Orders
								<Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
									12
								</Badge>
							</Link>
							<Link
								className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
								href="#"
							>
								<LineChartIcon className="h-4 w-4" />
								Analytics
							</Link>
						</nav>
					</div>
					<div className="mt-auto p-4">
						{/* <Card>
              <CardHeader className="pb-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="sm">
                  Upgrade
                </Button>
              </CardContent>
            </Card> */}
					</div>
				</div>
			</div>
			<div className="flex flex-col">
				<header className="flex h-[80px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
					<Link className="lg:hidden" href="#">
						<LeafIcon className="h-6 w-6" />
						<span className="sr-only">Home</span>
					</Link>
					<div className="flex-1">
						<h1 className="text-lg font-semibold">Welcome, Jane Doe</h1>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-800"
								size="icon"
								variant="ghost"
							>
								<Avatar>
									<AvatarImage
										src="https://github.com/shadcn.png"
										alt="@shadcn"
									/>
									<AvatarFallback>{`₱{"fa"}`}</AvatarFallback>
								</Avatar>
								<span className="sr-only">Toggle user menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Settings</DropdownMenuItem>
							<DropdownMenuItem>Support</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Logout</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</header>
				<main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						<Card>
							<CardHeader className="pb-4">
								<CardTitle>Total Products</CardTitle>
								<CardDescription>
									View and manage your product listings
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between">
									<span className="text-4xl font-bold">42</span>
									<Button size="sm">Manage</Button>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-4">
								<CardTitle>Recent Orders</CardTitle>
								<CardDescription>
									Review and fulfill your recent orders
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between">
									<span className="text-4xl font-bold">18</span>
									<Button size="sm">View</Button>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-4">
								<CardTitle>Total Revenue</CardTitle>
								<CardDescription>Track your sales performance</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between">
									<span className="text-4xl font-bold">₱12,345</span>
									<Button size="sm">Analyze</Button>
								</div>
							</CardContent>
						</Card>
					</div>
					<div className="rounded-lg border shadow-sm">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Product</TableHead>
									<TableHead>SKU</TableHead>
									<TableHead>Price</TableHead>
									<TableHead>Inventory</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableCell className="font-medium">
										<div className="flex items-center gap-3">
											<img
												alt="Product image"
												className="aspect-square rounded-md object-cover"
												height="64"
												src="/placeholder.svg"
												width="64"
											/>
											<div>
												<div>Organic Tomatoes</div>
												<div className="text-sm text-gray-500 dark:text-gray-400">
													Fresh from the farm
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell>TOT-001</TableCell>
									<TableCell>₱3.99</TableCell>
									<TableCell>120</TableCell>
									<TableCell>
										<Badge variant="secondary">In Stock</Badge>
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button size="icon" variant="ghost">
													<MoveHorizontalIcon className="h-4 w-4" />
													<span className="sr-only">Actions</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem>Edit</DropdownMenuItem>
												<DropdownMenuItem>Deactivate</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">
										<div className="flex items-center gap-3">
											<img
												alt="Product image"
												className="aspect-square rounded-md object-cover"
												height="64"
												src="/placeholder.svg"
												width="64"
											/>
											<div>
												<div>Organic Lettuce</div>
												<div className="text-sm text-gray-500 dark:text-gray-400">
													Fresh and crisp
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell>LET-002</TableCell>
									<TableCell>₱2.99</TableCell>
									<TableCell>80</TableCell>
									<TableCell>
										<Badge variant="secondary">In Stock</Badge>
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button size="icon" variant="ghost">
													<MoveHorizontalIcon className="h-4 w-4" />
													<span className="sr-only">Actions</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem>Edit</DropdownMenuItem>
												<DropdownMenuItem>Deactivate</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">
										<div className="flex items-center gap-3">
											<img
												alt="Product image"
												className="aspect-square rounded-md object-cover"
												height="64"
												src="/placeholder.svg"
												width="64"
											/>
											<div>
												<div>Organic Carrots</div>
												<div className="text-sm text-gray-500 dark:text-gray-400">
													Freshly harvested
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell>CAR-003</TableCell>
									<TableCell>₱2.49</TableCell>
									<TableCell>150</TableCell>
									<TableCell>
										<Badge variant="secondary">In Stock</Badge>
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button size="icon" variant="ghost">
													<MoveHorizontalIcon className="h-4 w-4" />
													<span className="sr-only">Actions</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem>Edit</DropdownMenuItem>
												<DropdownMenuItem>Deactivate</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">
										<div className="flex items-center gap-3">
											<img
												alt="Product image"
												className="aspect-square rounded-md object-cover"
												height="64"
												src="/placeholder.svg"
												width="64"
											/>
											<div>
												<div>Organic Apples</div>
												<div className="text-sm text-gray-500 dark:text-gray-400">
													Locally grown
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell>APP-004</TableCell>
									<TableCell>₱4.99</TableCell>
									<TableCell>90</TableCell>
									<TableCell>
										<Badge variant="secondary">In Stock</Badge>
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button size="icon" variant="ghost">
													<MoveHorizontalIcon className="h-4 w-4" />
													<span className="sr-only">Actions</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem>Edit</DropdownMenuItem>
												<DropdownMenuItem>Deactivate</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
					<div className="grid gap-4 md:grid-cols-2">
						<Card>
							<CardHeader className="pb-4">
								<CardTitle>Recent Orders</CardTitle>
								<CardDescription>
									Review and fulfill your recent orders
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Order</TableHead>
											<TableHead>Customer</TableHead>
											<TableHead>Date</TableHead>
											<TableHead>Total</TableHead>
											<TableHead>Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										<TableRow>
											<TableCell className="font-medium">#1234</TableCell>
											<TableCell>John Doe</TableCell>
											<TableCell>May 1, 2023</TableCell>
											<TableCell>₱45.99</TableCell>
											<TableCell>
												<Badge>Delivered</Badge>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className="font-medium">#1233</TableCell>
											<TableCell>Jane Smith</TableCell>
											<TableCell>April 28, 2023</TableCell>
											<TableCell>₱32.75</TableCell>
											<TableCell>
												<Badge variant="destructive">Pending</Badge>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className="font-medium">#1232</TableCell>
											<TableCell>Bob Johnson</TableCell>
											<TableCell>April 25, 2023</TableCell>
											<TableCell>₱58.99</TableCell>
											<TableCell>
												<Badge>Delivered</Badge>
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-4">
								<CardTitle>Sales Analytics</CardTitle>
								<CardDescription>Track your sales performance</CardDescription>
							</CardHeader>
							<CardContent>
								<LineChart className="aspect-[9/4]" />
							</CardContent>
						</Card>
					</div>
				</main>
			</div>
		</div>
	)
}

function BellIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
			<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
		</svg>
	)
}

function HomeIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
			<polyline points="9 22 9 12 15 12 15 22" />
		</svg>
	)
}

function LeafIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
			<path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
		</svg>
	)
}

function LineChart(props) {
	return (
		<div {...props}>
			<ResponsiveLine
				data={[
					{
						id: "Desktop",
						data: [
							{ x: "Jan", y: 43 },
							{ x: "Feb", y: 137 },
							{ x: "Mar", y: 61 },
							{ x: "Apr", y: 145 },
							{ x: "May", y: 26 },
							{ x: "Jun", y: 154 }
						]
					},
					{
						id: "Mobile",
						data: [
							{ x: "Jan", y: 60 },
							{ x: "Feb", y: 48 },
							{ x: "Mar", y: 177 },
							{ x: "Apr", y: 78 },
							{ x: "May", y: 96 },
							{ x: "Jun", y: 204 }
						]
					}
				]}
				margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
				xScale={{
					type: "point"
				}}
				yScale={{
					type: "linear"
				}}
				axisTop={null}
				axisRight={null}
				axisBottom={{
					tickSize: 0,
					tickPadding: 16
				}}
				axisLeft={{
					tickSize: 0,
					tickValues: 5,
					tickPadding: 16
				}}
				colors={["#2563eb", "#e11d48"]}
				pointSize={6}
				useMesh={true}
				gridYValues={6}
				theme={{
					tooltip: {
						chip: {
							borderRadius: "9999px"
						},
						container: {
							fontSize: "12px",
							textTransform: "capitalize",
							borderRadius: "6px"
						}
					},
					grid: {
						line: {
							stroke: "#f3f4f6"
						}
					}
				}}
				role="application"
			/>
		</div>
	)
}

function LineChartIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M3 3v18h18" />
			<path d="m19 9-5 5-4-4-3 3" />
		</svg>
	)
}

function MoveHorizontalIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polyline points="18 8 22 12 18 16" />
			<polyline points="6 8 2 12 6 16" />
			<line x1="2" x2="22" y1="12" y2="12" />
		</svg>
	)
}

function PackageIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="m7.5 4.27 9 5.15" />
			<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
			<path d="m3.3 7 8.7 5 8.7-5" />
			<path d="M12 22V12" />
		</svg>
	)
}

function ShoppingCartIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="8" cy="21" r="1" />
			<circle cx="19" cy="21" r="1" />
			<path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
		</svg>
	)
}
