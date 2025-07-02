import { VerificationBadge } from "@/app/dashboard/(admin)/users/(lists)/_components/badges"
import { FPBreadcrumbResponsive } from "@/components/fp/fp-breadcrumb"
import { FPContactNumberDisplay } from "@/components/fp/fp-contact-number"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/lib/utils"
import { getUserByIdUseCase } from "@/use-cases/users"
import {
	Calendar,
	CheckCircle2,
	Edit,
	Mail,
	MapPin,
	ShoppingBag,
	Star,
	User,
	XCircle
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Params {
	id: string
}

export default async function UserDetailsPage(props: { params: Params }) {
	const params = await props.params
	const user = await getUserByIdUseCase(params.id)

	if (!user) {
		return (
			<>
				<div className="container mx-auto max-w-screen-xl space-y-4 px-4 py-8 lg:px-6">
					<Card className="overflow-hidden border-none shadow-md dark:border-gray-800 dark:bg-gray-950/30 dark:shadow-md dark:shadow-black/10">
						<CardContent className="flex flex-col items-center justify-center p-12 text-center">
							<div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800/50">
								<User className="h-12 w-12 text-gray-400 dark:text-gray-500" />
							</div>
							<h2 className="mb-2 text-xl font-semibold">User not found</h2>
							<p className="mb-6 text-muted-foreground">
								The user you&apos;re looking for doesn&apos;t exist or has been
								removed
							</p>
							<Button asChild size="lg">
								<Link href="/dashboard/users">
									<User className="mr-2 h-4 w-4" />
									Back to Users
								</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</>
		)
	}

	const breadcrumbItems = [
		{ href: "/dashboard", label: "Dashboard" },
		{ href: "/dashboard/users", label: "Users" },
		{ label: user.name || "User" }
	]

	const { customer, farmer } = user
	const profileType = user.role.toLowerCase()
	const profileImage =
		user.image ||
		customer?.profilePicture ||
		farmer?.profilePicture ||
		"/profile-placeholder.png"

	// Calculate order and review counts
	const orderCount = customer?.orders?.length || 0
	const reviewCount = customer?.reviews?.length || 0

	// Calculate most recent activity
	const latestActivity = (() => {
		const dates = []
		if (customer?.orders?.length) {
			dates.push(...customer.orders.map((order) => new Date(order.createdAt)))
		}
		if (customer?.reviews?.length) {
			dates.push(
				...customer.reviews.map((review) => new Date(review.createdAt))
			)
		}
		return dates.length
			? new Date(Math.max(...dates.map((d) => d.getTime())))
			: null
	})()

	return (
		<>
			<div className="container mx-auto max-w-screen-xl space-y-6 px-4 py-8 lg:px-6">
				<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
					<FPBreadcrumbResponsive items={breadcrumbItems} />
					<Button
						asChild
						size="sm"
						className="gap-1.5 rounded-lg font-medium shadow-sm transition-all hover:shadow"
					>
						<Link href={`/dashboard/users/${params.id}/edit`}>
							<Edit className="h-4 w-4" />
							Edit User
						</Link>
					</Button>
				</div>

				{/* User Profile Header */}
				<Card className="overflow-hidden border-none shadow-md">
					<div className="relative h-32 w-full bg-gradient-to-r from-primary/5 to-primary/20 dark:from-primary/10 dark:to-primary/30">
						<div className="absolute -bottom-12 left-6">
							<div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800">
								{profileImage && (
									<Image
										src={profileImage}
										alt={user.name || "User"}
										width={96}
										height={96}
										className="h-full w-full object-cover"
										priority
									/>
								)}
							</div>
						</div>
					</div>
					<CardContent className="p-6 pt-16">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<div className="flex items-center gap-2">
									<h1 className="text-2xl font-semibold">{user.name}</h1>
									<Badge
										variant="outline"
										className="font-medium capitalize dark:border-gray-700"
									>
										{profileType}
									</Badge>
								</div>
								<div className="mt-1 flex items-center gap-2 text-muted-foreground">
									<Mail className="h-4 w-4" />
									<span>{user.email}</span>
									{user.isEmailVerified ? (
										<Badge
											variant="secondary"
											className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs dark:bg-green-900/20 dark:text-green-400"
										>
											<CheckCircle2 className="h-3 w-3 text-green-500" />
											<span>Verified</span>
										</Badge>
									) : (
										<Badge
											variant="outline"
											className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs dark:border-red-900/30 dark:text-red-400"
										>
											<XCircle className="h-3 w-3 text-red-500" />
											<span>Unverified</span>
										</Badge>
									)}
								</div>
								<div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
									<Calendar className="h-4 w-4" />
									<span>Member since {formatDate(user.createdAt)}</span>
								</div>
							</div>
							<div className="flex flex-col gap-2 sm:items-end">
								{customer && (
									<div className="grid grid-cols-3 gap-4 rounded-lg border p-4 dark:border-gray-800 dark:bg-gray-900/20">
										<div className="text-center">
											<div className="text-sm font-medium text-muted-foreground">
												Orders
											</div>
											<div className="flex items-center justify-center gap-1.5">
												<ShoppingBag className="h-4 w-4 text-primary" />
												<span className="text-2xl font-bold">{orderCount}</span>
											</div>
										</div>
										<div className="text-center">
											<div className="text-sm font-medium text-muted-foreground">
												Reviews
											</div>
											<div className="flex items-center justify-center gap-1.5">
												<Star className="h-4 w-4 text-yellow-500" />
												<span className="text-2xl font-bold">
													{reviewCount}
												</span>
											</div>
										</div>
										<div className="text-center">
											<div className="text-sm font-medium text-muted-foreground">
												Last Active
											</div>
											<div className="text-sm font-medium">
												{latestActivity ? formatDate(latestActivity) : "-"}
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Tabs for different user information sections */}
				<Tabs defaultValue="details" className="w-full">
					<TabsList className="mb-4 grid w-full grid-cols-3 rounded-lg bg-muted/60 p-1 dark:bg-gray-800/40 sm:w-auto">
						<TabsTrigger
							value="details"
							className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm dark:text-gray-200 dark:data-[state=active]:bg-gray-800"
						>
							User Details
						</TabsTrigger>
						<TabsTrigger
							value="orders"
							className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm dark:text-gray-200 dark:data-[state=active]:bg-gray-800"
						>
							Orders
						</TabsTrigger>
						<TabsTrigger
							value="reviews"
							className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm dark:text-gray-200 dark:data-[state=active]:bg-gray-800"
						>
							Reviews
						</TabsTrigger>
					</TabsList>

					{/* User Details Tab */}
					<TabsContent value="details" className="space-y-6">
						<Card className="overflow-hidden border-none shadow-md dark:border-gray-800 dark:bg-gray-950/30 dark:shadow-md dark:shadow-black/10">
							<CardHeader className="border-b bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/20 lg:p-6">
								<CardTitle className="text-lg font-medium">
									User Information
								</CardTitle>
							</CardHeader>
							<CardContent className="grid gap-6 p-4 pt-6 md:grid-cols-2 lg:p-6 lg:pt-6">
								<div className="space-y-4">
									<div>
										<h3 className="mb-1 text-sm font-medium text-muted-foreground">
											Name
										</h3>
										<p className="font-medium">{user.name}</p>
									</div>
									<div>
										<h3 className="mb-1 text-sm font-medium text-muted-foreground">
											Email
										</h3>
										<p className="font-medium">{user.email}</p>
									</div>
									<div>
										<h3 className="mb-1 text-sm font-medium text-muted-foreground">
											Role
										</h3>
										<p className="font-medium capitalize">{user.role}</p>
									</div>
									{customer?.contactNumber && (
										<div>
											<h3 className="mb-1 text-sm font-medium text-muted-foreground">
												Contact Number
											</h3>
											<p className="font-medium">
												<FPContactNumberDisplay
													contactNumber={customer.contactNumber}
												/>
											</p>
										</div>
									)}
								</div>
								<div className="space-y-4">
									<div>
										<h3 className="mb-1 text-sm font-medium text-muted-foreground">
											Email Verification
										</h3>
										<div>
											<VerificationBadge
												isEmailVerified={user.isEmailVerified}
											/>
										</div>
									</div>
									<div>
										<h3 className="mb-1 text-sm font-medium text-muted-foreground">
											Created At
										</h3>
										<p className="flex items-center gap-1.5 font-medium">
											<Calendar className="h-4 w-4 text-muted-foreground" />
											{formatDate(user.createdAt)}
										</p>
									</div>
									<div>
										<h3 className="mb-1 text-sm font-medium text-muted-foreground">
											Last Updated
										</h3>
										<p className="flex items-center gap-1.5 font-medium">
											<Calendar className="h-4 w-4 text-muted-foreground" />
											{formatDate(user.updatedAt)}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Address Information */}
						{customer?.address && customer.address.length > 0 && (
							<Card className="overflow-hidden border-none shadow-md dark:border-gray-800 dark:bg-gray-950/30 dark:shadow-md dark:shadow-black/10">
								<CardHeader className="border-b bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/20 lg:p-6">
									<CardTitle className="text-lg font-medium">
										Addresses
									</CardTitle>
								</CardHeader>
								<CardContent className="p-4 pt-6 lg:p-6">
									<div className="grid gap-4 md:grid-cols-2">
										{customer.address.map((address) => (
											<div
												key={address.id}
												className="rounded-lg border p-4 transition-all hover:border-primary/30 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900/10 dark:hover:border-primary/30"
											>
												<div className="flex items-start gap-3">
													<div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
														<MapPin className="h-4 w-4" />
													</div>
													<div>
														<p className="font-medium">
															{address.label || "Address"}
														</p>
														<p className="mt-1 text-sm text-muted-foreground">
															{address.fullAddress}
														</p>
														{address.note && (
															<p className="mt-2 border-t pt-2 text-xs italic text-muted-foreground dark:border-gray-800">
																Note: {address.note}
															</p>
														)}
													</div>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)}
					</TabsContent>

					{/* Orders Tab */}
					<TabsContent value="orders" className="space-y-6">
						<Card className="overflow-hidden border-none shadow-md dark:border-gray-800 dark:bg-gray-950/30 dark:shadow-md dark:shadow-black/10">
							<CardHeader className="border-b bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/20 lg:p-6">
								<CardTitle className="text-lg font-medium">
									Order History
								</CardTitle>
							</CardHeader>
							<CardContent className="p-4 pt-6 lg:p-6">
								{customer?.orders && customer.orders.length > 0 ? (
									<div className="space-y-4">
										{customer.orders.map((order) => {
											const statusColors = {
												COMPLETED:
													"bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30",
												CANCELLED:
													"bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30",
												PENDING:
													"bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30",
												PROCESSING:
													"bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30",
												SHIPPED:
													"bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/30"
											}

											const statusColor =
												statusColors[
													order.status as keyof typeof statusColors
												] || "border-gray-200 dark:border-gray-800"

											return (
												<div
													key={order.id}
													className={`rounded-lg border p-4 transition-all hover:shadow-sm dark:bg-gray-900/10 ${statusColor}`}
												>
													<div className="flex items-center justify-between">
														<div>
															<div className="flex items-center gap-2">
																<ShoppingBag className="h-4 w-4 text-primary" />
																<p className="font-medium">
																	Order #{order.id.slice(-8).toUpperCase()}
																</p>
															</div>
															<p className="text-sm text-muted-foreground">
																{formatDate(order.createdAt)}
															</p>
														</div>
														<Badge
															variant={
																order.status === "COMPLETED"
																	? "default"
																	: order.status === "CANCELLED"
																		? "destructive"
																		: "outline"
															}
															className="font-medium"
														>
															{order.status}
														</Badge>
													</div>
													<Separator className="my-3 dark:bg-gray-800" />
													<div className="text-sm">
														<div className="flex justify-between">
															<span className="text-muted-foreground">
																Total Items:
															</span>
															<span className="font-medium">-</span>
														</div>
														<div className="mt-1 flex justify-between">
															<span className="text-muted-foreground">
																Total Amount:
															</span>
															<span className="font-semibold text-primary">
																₱{order.totalPrice?.toFixed(2) || "0.00"}
															</span>
														</div>
													</div>
													<div className="mt-3 text-right">
														<Link
															href={`/dashboard/orders/${order.id}`}
															className="inline-flex items-center text-xs font-medium text-primary hover:underline"
														>
															View Order Details
															<svg
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 20 20"
																fill="currentColor"
																className="ml-1 h-3 w-3"
															>
																<path
																	fillRule="evenodd"
																	d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
																	clipRule="evenodd"
																/>
															</svg>
														</Link>
													</div>
												</div>
											)
										})}
									</div>
								) : (
									<div className="flex flex-col items-center justify-center py-12 text-center">
										<div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800/50">
											<ShoppingBag className="h-8 w-8 text-muted-foreground" />
										</div>
										<h3 className="text-lg font-medium">No Orders Yet</h3>
										<p className="mt-2 max-w-md text-sm text-muted-foreground">
											This user has not placed any orders yet. When they do,
											their order history will appear here.
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* Reviews Tab */}
					<TabsContent value="reviews" className="space-y-6">
						<Card className="overflow-hidden border-none shadow-md dark:border-gray-800 dark:bg-gray-950/30 dark:shadow-md dark:shadow-black/10">
							<CardHeader className="border-b bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/20 lg:p-6">
								<CardTitle className="text-lg font-medium">Reviews</CardTitle>
							</CardHeader>
							<CardContent className="p-4 pt-6 lg:p-6">
								{customer?.reviews && customer.reviews.length > 0 ? (
									<div className="grid gap-4 md:grid-cols-2">
										{customer.reviews.map((review) => (
											<div
												key={review.id}
												className="rounded-lg border p-4 transition-all hover:border-yellow-200 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900/10 dark:hover:border-yellow-900/30"
											>
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-1">
														{[...Array(5)].map((_, i) => (
															<Star
																key={i}
																className={`h-4 w-4 ${
																	i < review.rating
																		? "fill-yellow-400 text-yellow-400"
																		: "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
																}`}
															/>
														))}
														<span className="ml-1 font-medium">
															{review.rating}/5
														</span>
													</div>
													<p className="text-xs text-muted-foreground">
														{formatDate(review.createdAt)}
													</p>
												</div>
												<p className="mt-3 text-sm">
													{review.comment || "No comment provided"}
												</p>
												<div className="mt-3 text-right">
													<Link
														href={`/dashboard/products/${review.productId}`}
														className="inline-flex items-center text-xs font-medium text-primary hover:underline"
													>
														View Product
														<svg
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 20 20"
															fill="currentColor"
															className="ml-1 h-3 w-3"
														>
															<path
																fillRule="evenodd"
																d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
																clipRule="evenodd"
															/>
														</svg>
													</Link>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="flex flex-col items-center justify-center py-12 text-center">
										<div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800/50">
											<Star className="h-8 w-8 text-muted-foreground" />
										</div>
										<h3 className="text-lg font-medium">No Reviews Yet</h3>
										<p className="mt-2 max-w-md text-sm text-muted-foreground">
											This user has not left any product reviews yet. When they
											do, their reviews will appear here.
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</>
	)
}
