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
	status?: OrderStatus | null
	search?: string | null
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
			customerContact: {
				select: {
					contactName: true,
					contactNumber: true,
					note: true,
					longitude: true,
					latitude: true,
					fullAddress: true
				}
			},
			pickupLocation: true,
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
					},
					address: {
						select: {
							fullAddress: true,
							longitude: true,
							latitude: true,
							street: true,
							contactName: true,
							contactNumber: true
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
		},
		orderBy: {
			updatedAt: "desc"
		}
	})
}

export const getCustomerOrderStatuses = async (customerId?: string) => {
	return await db.order.findMany({
		where: {
			customerId
		},
		select: {
			status: true
		}
	})
}

export const getCustomerOrders = async (filter: {
	status?: OrderStatus | null
	search?: string | null
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
			updatedAt: "desc"
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
					address: {
						select: {
							fullAddress: true,
							longitude: true,
							latitude: true,
							street: true
						}
					},
					profilePicture: true,
					contactNumber: true,
					farmName: true,
					id: true
				}
			}
		}
	})
}
