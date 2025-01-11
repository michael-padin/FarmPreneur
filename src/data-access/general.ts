import { verifySession } from "@/lib/dal"
import { db } from "@/lib/db"
import { getMonthRangeByDate } from "@/lib/utils"

export const getOverviewMetrics = async () => {
	await verifySession()
	const currentDate = new Date()
	const { currentMonth, previousMonth } = getMonthRangeByDate(currentDate)

	const totalUsersLastMonth = await db.user.count({
		where: {
			createdAt: {
				gte: previousMonth.start,
				lte: previousMonth.end
			}
		}
	})

	const userRoles = await db.user.findMany({
		select: {
			role: true
		}
	})

	const products = await db.product.findMany({
		select: {
			listingStatus: true
		}
	})
	const totalPendingProducts = products.filter(
		(product) => product.listingStatus === "PENDING"
	).length
	const totalApprovedProducts = products.filter(
		(product) => product.listingStatus === "APPROVED"
	).length
	const totalRejectedProducts = products.filter(
		(product) => product.listingStatus === "REJECTED"
	).length
	const totalUnlistedProducts = products.filter(
		(product) => product.listingStatus === "UNLISTED"
	).length

	const totalAdmins = userRoles.filter((user) => user.role === "ADMIN").length
	const totalCustomers = userRoles.filter(
		(user) => user.role === "CUSTOMER"
	).length
	const totalFarmers = userRoles.filter((user) => user.role === "FARMER").length

	const totalUsersCurrentMonth = await db.user.count({
		where: {
			createdAt: {
				gte: currentMonth.start,
				lte: currentMonth.end
			}
		}
	})
	const totalUsersAllTime = await db.user.count()
	const usersChange = totalUsersCurrentMonth - totalUsersLastMonth

	const totalCategories = await db.category.count()

	const totalOrderLastMonth = await db.user.count({
		where: {
			createdAt: {
				gte: previousMonth.start,
				lte: previousMonth.end
			}
		}
	})

	const totalOrderCurrentMonth = await db.user.count({
		where: {
			createdAt: {
				gte: currentMonth.start,
				lte: currentMonth.end
			}
		}
	})
	const ordersChange = totalOrderCurrentMonth - totalOrderLastMonth
	const totalOrdersAllTime = await db.order.count()
	const orders = await db.order.findMany({
		select: {
			status: true
		}
	})
	const totalPendingOrders = orders.filter(
		(order) => order.status === "PENDING"
	).length
	const totalInProgressOrders = orders.filter(
		(order) => order.status === "IN_PROGRESS"
	).length
	const totalCompletedOrders = orders.filter(
		(order) => order.status === "COMPLETED"
	).length
	const totalCancelledOrders = orders.filter(
		(order) => order.status === "CANCELLED"
	).length

	const totalProductsLastMonth = await db.product.count({
		where: {
			createdAt: {
				gte: previousMonth.start,
				lte: previousMonth.end
			}
		}
	})

	const totalProductsCurrentMonth = await db.product.count({
		where: {
			createdAt: {
				gte: currentMonth.start,
				lte: currentMonth.end
			}
		}
	})
	const totalProducts = await db.product.count()
	const productsChange = totalProductsCurrentMonth - totalProductsLastMonth

	const totalSalesLastMonth = await db.order.aggregate({
		where: {
			status: "COMPLETED",
			createdAt: {
				gte: previousMonth.start,
				lte: previousMonth.end
			}
		},
		_sum: {
			quantity: true
		}
	})

	const totalSalesCurrentMonth = await db.order.aggregate({
		where: {
			status: "COMPLETED",
			createdAt: {
				gte: currentMonth.start,
				lte: currentMonth.end
			}
		},
		_sum: {
			quantity: true
		}
	})

	const totalSales = await db.order.aggregate({
		_sum: {
			quantity: true
		}
	})

	const salesChange =
		(totalSalesCurrentMonth._sum.quantity || 0) -
		(totalSalesLastMonth._sum.quantity || 0)

	const totalRevenue = await db.order.aggregate({
		where: {
			status: "COMPLETED"
		},
		_sum: {
			totalPrice: true
		}
	})

	// Get average rating and review count
	const { _avg: { rating } = {}, _count: { _all: totalReviews } = {} } =
		await db.productReview.aggregate({
			_avg: { rating: true },
			_count: { _all: true },
			where: {
				status: "PUBLISHED" // Ensure only published reviews are considered
			}
		})

	// Query for last month's revenue
	const lastMonthRevenueResult = await db.order.aggregate({
		where: {
			AND: [
				{ status: "COMPLETED" },
				{
					createdAt: {
						gte: previousMonth.start,
						lte: previousMonth.end
					}
				}
			]
		},
		_sum: {
			totalPrice: true
		}
	})

	// Query for current month's revenue
	const currentMonthRevenueResult = await db.order.aggregate({
		where: {
			AND: [
				{ status: "COMPLETED" },
				{
					createdAt: {
						gte: currentMonth.start,
						lte: currentMonth.end
					}
				}
			]
		},
		_sum: {
			totalPrice: true
		}
	})

	const lastMonthRevenue = lastMonthRevenueResult._sum.totalPrice || 0
	const currentMonthRevenue = currentMonthRevenueResult._sum.totalPrice || 0

	const revenueChange = currentMonthRevenue - lastMonthRevenue

	return {
		users: {
			totalUsers: totalUsersAllTime,
			totalAdmins,
			totalCustomers,
			totalFarmers,
			usersChange: usersChange
		},
		categories: {
			totalCategories: totalCategories
		},
		sales: {
			totalSales: totalSales._sum.quantity || 0,
			salesChange: salesChange
		},
		revenue: {
			totalRevenue: totalRevenue._sum.totalPrice || 0,
			revenueChange
		},
		products: {
			totalProducts: totalProducts,
			totalPendingProducts,
			totalApprovedProducts,
			totalRejectedProducts,
			totalUnlistedProducts,
			productsChange: productsChange
		},
		orders: {
			totalPendingOrders,
			totalInProgressOrders,
			totalCompletedOrders,
			totalCancelledOrders,
			totalOrders: totalOrdersAllTime,
			ordersChange: ordersChange
		},
		rating: {
			averageRating: rating || 0,
			totalReviews: totalReviews || 0
		}
	}
}
