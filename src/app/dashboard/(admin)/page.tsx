import { DashboardHeader } from "@/app/_components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"

export default function AdminDashboard() {
	return (
		<>
			<DashboardHeader />
			<div className="flex h-screen overflow-hidden">
				{/* Main Content */}
				<div className="flex flex-1 flex-col overflow-hidden">
					{/* Header */}
					{/* Main Content */}
					<main className="flex-1 overflow-y-auto p-4">
						<div className="mx-auto max-w-7xl">
							<h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>
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
								<h2 className="mb-4 text-xl font-semibold">Recent Orders</h2>
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
		</>
	)
}
