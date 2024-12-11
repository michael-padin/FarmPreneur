import { db } from "@/lib/db"
import { OrderStatus } from "@prisma/client"

export const getOrders = async () => {
	return await db.order.findMany({
		orderBy: {
			createdAt: "desc"
		},
		include: {
			items: {
				include: {
					product: {
						include: {
							images: true
						}
					}
				}
			},
			farmer: {
				include: {
					user: {
						select: {
							name: true
						}
					}
				}
			},
			customer: {
				include: {
					user: {
						select: {
							name: true
						}
					}
				}
			},
			pickupLocation: true
		}
	})
}

export const getTotalOrders = async () => {
	return await db.order.count()
}
export const getTotalOrdersByDate = async (date: Date) => {
	return await db.order.count({
		where: {
			createdAt: {
				gte: date
			}
		}
	})
}

export const getTotalRevenueByDate = async (date: Date) => {
	return await db.order.aggregate({
		where: {
			createdAt: {
				gte: date
			}
		},
		_sum: {
			totalPrice: true
		}
	})
}

export const getRecentOrders = async () => {
	return await db.order.findMany({
		orderBy: {
			createdAt: "desc"
		},
		include: {
			items: {
				include: {
					product: {
						include: {
							images: true
						}
					}
				}
			},
			farmer: {
				include: {
					user: {
						select: {
							name: true
						}
					}
				}
			},
			customer: {
				include: {
					user: {
						select: {
							name: true
						}
					}
				}
			},
			pickupLocation: true
		},
		take: 10
	})
}

export const getFarmerOrders = async (filter: {
	status: OrderStatus | null
	search: string | null
	userId: string
}) => {
	return await db.order.findMany({
		where: {
			farmer: {
				userId: filter.userId
			},
			...(filter.status && { status: filter.status }),
			...(filter.search && {
				OR: [
					{
						items: {
							some: {
								product: {
									title: { contains: filter.search, mode: "insensitive" }
								}
							}
						}
					},
					{
						customer: {
							user: { name: { contains: filter.search, mode: "insensitive" } }
						}
					}
				]
			})
		},
		include: {
			items: {
				include: {
					product: {
						include: { images: true }
					}
				}
			},
			customer: {
				include: {
					user: {
						select: {
							name: true
						}
					}
				}
			},
			farmer: {
				include: {
					user: {
						select: {
							name: true
						}
					}
				}
			}
		}
	})
}

export const getCustomerOrders = async (filter: {
	status: OrderStatus | null
	search: string | null
	customerId: string
}) => {
	return await db.order.findMany({
		where: {
			customerId: filter.customerId,
			...(filter.status && { status: filter.status }),
			...(filter.search && {
				OR: [
					{
						items: {
							some: {
								product: {
									title: { contains: filter.search, mode: "insensitive" }
								}
							}
						}
					},
					{
						farmer: {
							user: { name: { contains: filter.search, mode: "insensitive" } },
							address: {
								some: {
									fullAddress: {
										contains: filter.search,
										mode: "insensitive"
									}
								}
							},
							farmName: {
								contains: filter.search,
								mode: "insensitive"
							}
						}
					}
				]
			})
		},
		orderBy: {
			createdAt: "desc"
		},
		include: {
			items: {
				include: {
					product: {
						select: {
							title: true,
							price: true,
							unit: true,
							images: {
								select: {
									url: true,
									altText: true
								}
							}
						}
					}
				}
			},
			pickupLocation: {
				select: {
					fullAddress: true,
					latitude: true,
					longitude: true,
					note: true
				}
			},
			customer: {
				select: {
					address: {
						select: {
							fullAddress: true,
							longitude: true,
							latitude: true,
							street: true
						}
					}
				}
			},
			farmer: {
				select: {
					contactNumber: true,
					farmName: true,
					id: true
				}
			}
		}
	})
}

export const createOrder = async (data: {
	items: {
		quantity: number
		price: number
		productId: string
	}[]
	addressId: string
	customerId: string
	farmerId: string
}) => {
	return await db.order.create({
		data: {
			items: {
				create: data.items.map((item) => ({
					quantity: item.quantity,
					price: item.price,
					productId: item.productId
				}))
			},
			pickupLocationId: data.addressId,
			customerId: data.customerId,
			farmerId: data.farmerId
		},
		include: {
			items: true,
			customer: {
				include: {
					user: {
						select: {
							name: true
						}
					}
				}
			},
			farmer: {
				include: {
					user: {
						select: {
							name: true
						}
					}
				}
			},
			pickupLocation: true
		}
	})
}
