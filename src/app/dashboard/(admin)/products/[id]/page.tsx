import { DashboardHeader } from "@/app/_components/header"
import { FPBreadcrumbResponsive } from "@/components/fp/fp-breadcrumb"
import { FPStarRating } from "@/components/fp/fp-star-rating"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UnitKey, unitMap } from "@/constants/unit"
import { db } from "@/lib/db"
import { formatDate, formatPHP } from "@/lib/utils"
import { ProductListingStatus } from "@prisma/client"
import {
	Calendar,
	Edit,
	MapPin,
	Package,
	ShoppingBag,
	Star,
	Truck,
	User
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ReactElement } from "react"
import { Gallery } from "./_components/gallery"

interface Params {
	id: string
}

const getProduct = async (id: string) => {
	// Enhanced query that includes _count and reviews
	return await db.product.findFirst({
		where: { id },
		include: {
			farmer: {
				select: {
					profilePicture: true,
					farmName: true,
					id: true,
					contactNumber: true,
					user: {
						select: {
							id: true
						}
					},
					address: {
						select: {
							id: true,
							fullAddress: true,
							longitude: true,
							latitude: true,
							note: true
						}
					}
				}
			},
			category: true,
			reviews: true,
			_count: {
				select: {
					orderItem: true,
					reviews: true
				}
			},
			orderItem: {
				include: {
					order: {
						select: {
							status: true
						}
					}
				}
			}
		}
	})
}

const ProductListingStatusBadge = ({
	status
}: {
	status: ProductListingStatus
}) => {
	const variants: Record<
		ProductListingStatus,
		{ bg: string; text: string; icon: ReactElement }
	> = {
		APPROVED: {
			bg: "bg-green-50 dark:bg-green-900/20",
			text: "text-green-700 dark:text-green-400",
			icon: <Badge className="mr-1 h-2 w-2 bg-green-500" variant="default" />
		},
		PENDING: {
			bg: "bg-yellow-50 dark:bg-yellow-900/20",
			text: "text-yellow-700 dark:text-yellow-400",
			icon: <Badge className="mr-1 h-2 w-2 bg-yellow-500" variant="default" />
		},
		REJECTED: {
			bg: "bg-red-50 dark:bg-red-900/20",
			text: "text-red-700 dark:text-red-400",
			icon: <Badge className="mr-1 h-2 w-2 bg-red-500" variant="default" />
		},
		OUT_OF_STOCK: {
			bg: "bg-gray-50 dark:bg-gray-800/40",
			text: "text-gray-700 dark:text-gray-400",
			icon: <Badge className="mr-1 h-2 w-2 bg-gray-500" variant="default" />
		},
		UNLISTED: {
			bg: "bg-gray-50 dark:bg-gray-800/40",
			text: "text-gray-700 dark:text-gray-400",
			icon: <Badge className="mr-1 h-2 w-2 bg-gray-500" variant="default" />
		},
		EXPIRED: {
			bg: "bg-orange-50 dark:bg-orange-900/20",
			text: "text-orange-700 dark:text-orange-400",
			icon: <Badge className="mr-1 h-2 w-2 bg-orange-500" variant="default" />
		},
		PAUSED: {
			bg: "bg-blue-50 dark:bg-blue-900/20",
			text: "text-blue-700 dark:text-blue-400",
			icon: <Badge className="mr-1 h-2 w-2 bg-blue-500" variant="default" />
		}
	}

	return (
		<span
			className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[status].bg} ${variants[status].text}`}
		>
			{variants[status].icon}
			{status}
		</span>
	)
}

export default async function ProductDetailsPage(props: { params: Params }) {
	const params = await props.params
	const product = await getProduct(params.id)

	if (!product) {
		return (
			<>
				<DashboardHeader />
				<div className="container mx-auto max-w-screen-xl space-y-4 px-4 py-8 lg:px-6">
					<Card className="overflow-hidden border-none shadow-md">
						<CardContent className="flex flex-col items-center justify-center p-12 text-center">
							<div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800/50">
								<Package className="h-12 w-12 text-gray-400 dark:text-gray-500" />
							</div>
							<h2 className="mb-2 text-xl font-semibold">Product not found</h2>
							<p className="mb-6 text-muted-foreground">
								The product you&apos;re looking for doesn&apos;t exist or has
								been removed
							</p>
							<Button asChild size="lg">
								<Link href="/dashboard/products">
									<ShoppingBag className="mr-2 h-4 w-4" />
									Back to Products
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
		{ href: "/dashboard/products", label: "Products" },
		{ label: product.title }
	]

	// Calculate total orders, completed orders, and average rating
	const orderItems = product._count?.orderItem || 0

	// Calculate completed orders by filtering the orderItems
	const completedOrders =
		product.orderItem?.filter((item) => item.order?.status === "COMPLETED")
			?.length || 0

	const totalReviews = product._count?.reviews || 0
	let averageRating = 0

	if (product.reviews && product.reviews.length > 0) {
		const sum = product.reviews.reduce(
			(acc: number, review: any) => acc + review.rating,
			0
		)
		averageRating = sum / product.reviews.length
	}

	// Get product images
	const productImages = product.productImages || []

	return (
		<>
			<DashboardHeader />
			<div className="container mx-auto max-w-screen-xl space-y-6 px-4 py-8 lg:px-6">
				<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
					<FPBreadcrumbResponsive items={breadcrumbItems} />
					<Button
						asChild
						size="sm"
						className="gap-1.5 rounded-lg font-medium shadow-sm transition-all hover:shadow"
					>
						<Link href={`/dashboard/products/${params.id}/edit`}>
							<Edit className="h-4 w-4" />
							Edit Product
						</Link>
					</Button>
				</div>

				{/* Main Product Section */}
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{/* Product Images - Takes up the first column on larger screens */}
					<Card className="h-fit overflow-hidden border-none shadow-md md:col-span-1">
						<CardContent className="p-0">
							<Gallery images={productImages} title={product.title} />
						</CardContent>
					</Card>

					{/* Product Info - Takes up the second column on larger screens */}
					<Card className="overflow-hidden border-none shadow-md md:col-span-1 lg:col-span-2">
						<CardHeader className="border-b p-4 lg:p-6">
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<ProductListingStatusBadge status={product.listingStatus} />
									{product.category && (
										<Link
											href={`/dashboard/products?category=${product.category.id}`}
											className="text-xs text-muted-foreground hover:text-foreground hover:underline"
										>
											{product.category.name}
										</Link>
									)}
								</div>
								<h1 className="text-2xl font-semibold capitalize tracking-tight">
									{product.title}
								</h1>
								<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
									<div className="flex items-center gap-1">
										<Star className="h-4 w-4 text-yellow-500" />
										<span className="font-medium">
											{averageRating.toFixed(1)}
										</span>
										<span className="text-muted-foreground">
											({totalReviews} reviews)
										</span>
									</div>
									<div className="flex items-center gap-1 text-muted-foreground">
										<ShoppingBag className="h-4 w-4" />
										<span>{completedOrders} sold</span>
									</div>
								</div>
							</div>
						</CardHeader>
						<CardContent className="divide-y divide-border p-0 dark:divide-gray-800">
							<div className="p-4 lg:p-6">
								<div className="mb-4 flex items-baseline">
									<div className="text-3xl font-bold text-primary">
										₱{formatPHP(product.price)}
									</div>
									<div className="ml-2 text-base text-muted-foreground">
										per {unitMap[product.unit as UnitKey] || product.unit}
									</div>
								</div>

								<div className="space-y-4">
									<div>
										<h3 className="mb-1 text-sm font-medium text-muted-foreground">
											Description
										</h3>
										<p className="whitespace-pre-line text-sm leading-relaxed">
											{product.description}
										</p>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div>
											<h3 className="mb-1 text-sm font-medium text-muted-foreground">
												Stock
											</h3>
											<p className="flex items-center gap-1.5 font-medium">
												<Package className="h-4 w-4 text-muted-foreground" />
												{product.quantity}{" "}
												{unitMap[product.unit as UnitKey] || product.unit}
											</p>
										</div>

										<div>
											<h3 className="mb-1 text-sm font-medium text-muted-foreground">
												Created
											</h3>
											<p className="flex items-center gap-1.5">
												<Calendar className="h-4 w-4 text-muted-foreground" />
												{formatDate(product.createdAt)}
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Farmer Information */}
							<div className="p-4 lg:p-6">
								<h3 className="mb-3 text-sm font-medium text-muted-foreground">
									Farmer Information
								</h3>
								<div className="flex items-start gap-3">
									{product.farmer?.profilePicture ? (
										<div className="h-10 w-10 overflow-hidden rounded-full border dark:border-gray-700">
											<Image
												src={product.farmer.profilePicture}
												alt={product.farmer.farmName || "Farmer"}
												width={40}
												height={40}
												className="h-full w-full object-cover"
											/>
										</div>
									) : (
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
											<User className="h-5 w-5" />
										</div>
									)}
									<div className="flex-1">
										<div className="flex items-center justify-between">
											<h4 className="font-medium">
												{product.farmer?.farmName || "Unknown Farmer"}
											</h4>
											<Link
												href={`/dashboard/users/${product.farmer?.user.id}`}
												className="text-xs font-medium text-primary hover:underline"
											>
												View Profile
											</Link>
										</div>
										{product.farmer?.contactNumber && (
											<p className="mt-1 text-sm text-muted-foreground">
												{product.farmer.contactNumber}
											</p>
										)}
										{product.farmer?.address &&
											product.farmer.address.length > 0 && (
												<div className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
													<MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
													<span>{product.farmer.address[0].fullAddress}</span>
												</div>
											)}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Analytics - Takes full width */}
					<Card className="overflow-hidden border-none shadow-md dark:border-gray-800 dark:bg-gray-950/30 dark:shadow-md dark:shadow-black/10 md:col-span-2 lg:col-span-3">
						<CardHeader className="border-b bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/20 lg:p-6">
							<CardTitle className="text-lg font-medium">
								Product Analytics
							</CardTitle>
						</CardHeader>
						<CardContent className="p-0">
							<div className="grid grid-cols-2 gap-px bg-gray-100 dark:bg-gray-800 sm:grid-cols-4">
								<div className="bg-card p-6 text-center dark:bg-gray-900/20">
									<h3 className="text-sm font-medium text-muted-foreground">
										Total Orders
									</h3>
									<div className="mt-2 flex items-center justify-center gap-2">
										<ShoppingBag className="h-5 w-5 text-primary" />
										<p className="text-3xl font-bold">{orderItems}</p>
									</div>
								</div>
								<div className="bg-card p-6 text-center dark:bg-gray-900/20">
									<h3 className="text-sm font-medium text-muted-foreground">
										Reviews
									</h3>
									<div className="mt-2 flex items-center justify-center gap-2">
										<Star className="h-5 w-5 text-yellow-500" />
										<p className="text-3xl font-bold">{totalReviews}</p>
									</div>
								</div>
								<div className="bg-card p-6 text-center dark:bg-gray-900/20">
									<h3 className="text-sm font-medium text-muted-foreground">
										Average Rating
									</h3>
									<div className="mt-2 flex items-center justify-center gap-2">
										<p className="text-3xl font-bold">
											{averageRating.toFixed(1)}
										</p>
										<div className="flex">
											<FPStarRating rating={averageRating} />
										</div>
									</div>
								</div>
								<div className="bg-card p-6 text-center dark:bg-gray-900/20">
									<h3 className="text-sm font-medium text-muted-foreground">
										Total Sold
									</h3>
									<div className="mt-2 flex items-center justify-center gap-2">
										<Truck className="h-5 w-5 text-green-500" />
										<p className="text-3xl font-bold">{completedOrders}</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	)
}
