"use client"
import Link from "next/link"
import {
	Activity,
	ArrowUpRight,
	CircleUser,
	Leaf,
	Menu,
	Package2,
	Search,
	Sprout,
	TrendingUp,
	Truck
} from "lucide-react"
import { motion } from "framer-motion"

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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"

const MotionCard = motion(Card)

export function Dashboard() {
	return (
		<main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
			{/* <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
				<MotionCard
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
				>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">₱62,345.00</div>
						<p className="text-xs text-muted-foreground">
							+15.2% from last month
						</p>
					</CardContent>
				</MotionCard>

				<MotionCard
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.2 }}
				>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Orders</CardTitle>
						<Truck className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">256</div>
						<p className="text-xs text-muted-foreground">
							+12.3% from last month
						</p>
					</CardContent>
				</MotionCard>
			</div>
			<div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
				<MotionCard
					className="xl:col-span-2"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.4 }}
				>
					<CardHeader className="flex flex-row items-center">
						<div className="grid gap-2">
							<CardTitle>Recent Orders</CardTitle>
							<CardDescription>Your latest produce orders.</CardDescription>
						</div>
						<Button asChild size="sm" className="ml-auto gap-1">
							<Link href="/dashboard">
								View All
								<ArrowUpRight className="h-4 w-4" />
							</Link>
						</Button>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Customer</TableHead>
									<TableHead className="hidden xl:table-column">
										Product
									</TableHead>
									<TableHead className="hidden xl:table-column">
										Status
									</TableHead>
									<TableHead className="hidden xl:table-column">Date</TableHead>
									<TableHead className="text-right">Amount</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableCell>
										<div className="font-medium">Cubao Market</div>
										<div className="hidden text-sm text-muted-foreground md:inline">
											info@cubaomarket.com
										</div>
									</TableCell>
									<TableCell className="hidden xl:table-column">
										Kamatis
									</TableCell>
									<TableCell className="hidden xl:table-column">
										<Badge className="text-xs" variant="outline">
											Delivered
										</Badge>
									</TableCell>
									<TableCell className="hidden md:table-cell lg:hidden xl:table-column">
										2023-06-23
									</TableCell>
									<TableCell className="text-right">₱2,500.00</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<div className="font-medium">Divisoria Wholesale</div>
										<div className="hidden text-sm text-muted-foreground md:inline">
											orders@divisoria.com
										</div>
									</TableCell>
									<TableCell className="hidden xl:table-column">
										Saging Saba
									</TableCell>
									<TableCell className="hidden xl:table-column">
										<Badge className="text-xs" variant="outline">
											Processing
										</Badge>
									</TableCell>
									<TableCell className="hidden md:table-cell lg:hidden xl:table-column">
										2023-06-24
									</TableCell>
									<TableCell className="text-right">₱1,800.00</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<div className="font-medium">Baguio City Market</div>
										<div className="hidden text-sm text-muted-foreground md:inline">
											hello@baguiomarket.com
										</div>
									</TableCell>
									<TableCell className="hidden xl:table-column">
										Strawberry
									</TableCell>
									<TableCell className="hidden xl:table-column">
										<Badge className="text-xs" variant="outline">
											Shipped
										</Badge>
									</TableCell>
									<TableCell className="hidden md:table-cell lg:hidden xl:table-column">
										2023-06-25
									</TableCell>
									<TableCell className="text-right">₱3,200.00</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<div className="font-medium">Tagaytay Organic Farm</div>
										<div className="hidden text-sm text-muted-foreground md:inline">
											chef@tagaytayorganic.com
										</div>
									</TableCell>
									<TableCell className="hidden xl:table-column">
										Lettuce
									</TableCell>
									<TableCell className="hidden xl:table-column">
										<Badge className="text-xs" variant="outline">
											Delivered
										</Badge>
									</TableCell>
									<TableCell className="hidden md:table-cell lg:hidden xl:table-column">
										2023-06-26
									</TableCell>
									<TableCell className="text-right">₱950.00</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<div className="font-medium">Cebu Farmers Market</div>
										<div className="hidden text-sm text-muted-foreground md:inline">
											orders@cebufarmers.com
										</div>
									</TableCell>
									<TableCell className="hidden xl:table-column">
										Mangga
									</TableCell>
									<TableCell className="hidden xl:table-column">
										<Badge className="text-xs" variant="outline">
											Processing
										</Badge>
									</TableCell>
									<TableCell className="m d:table-cell hidden lg:hidden xl:table-column">
										2023-06-27
									</TableCell>
									<TableCell className="text-right">₱4,500.00</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</CardContent>
				</MotionCard>
				<MotionCard
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.5 }}
				>
					<CardHeader>
						<CardTitle>Top Selling Products</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-8">
						{[
							{ name: "Kamatis", category: "Vegetables", amount: "450 kg" },
							{
								name: "Saging Lakatan",
								category: "Fruits",
								amount: "320 kg"
							},
							{
								name: "Itlog na Pula",
								category: "Eggs",
								amount: "200 dozens"
							},
							{ name: "Kalabaw Cheese", category: "Dairy", amount: "180 kg" },
							{ name: "Calamansi", category: "Fruits", amount: "150 kg" }
						].map((product, index) => (
							<motion.div
								key={product.name}
								className="flex items-center gap-4"
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.3, delay: 0.1 * index }}
							>
								<Avatar className="hidden h-9 w-9 sm:flex">
									<AvatarImage
										src={`/placeholder.svg?height=36&width=36`}
										alt={product.name}
									/>
									<AvatarFallback>{product.name[0]}</AvatarFallback>
								</Avatar>
								<div className="grid gap-1">
									<p className="text-sm font-medium leading-none">
										{product.name}
									</p>
									<p className="text-sm text-muted-foreground">
										{product.category}
									</p>
								</div>
								<div className="ml-auto font-medium">{product.amount}</div>
							</motion.div>
						))}
					</CardContent>
				</MotionCard>
			</div> */}
		</main>
	)
}
