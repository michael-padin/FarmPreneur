import { FarmRegistrationSchema } from "@/app/(auth)/(farmer)/farmer-registration/types"
import { RegisterSchema } from "@/app/(auth)/signup/_types"
import { UpdateUserTypes } from "@/app/dashboard/(admin)/users/(lists)/types"
import { EditUserSchema } from "@/app/dashboard/(admin)/users/[id]/edit/validations"
import { db } from "@/lib/db"
import { ROLE } from "@prisma/client"

export const getUserById = async (id: string) => {
	return await db.user.findUnique({
		where: {
			id: id
		},
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			isEmailVerified: true,
			createdAt: true,
			image: true,
			updatedAt: true,
			customer: {
				include: {
					address: true,
					cart: true,
					orders: true,
					reviews: true,
					wishlist: true
				}
			},
			farmer: {
				include: {
					_count: {
						select: {
							farmImages: true,
							products: true,
							orders: true,
							reviews: true
						}
					},
					address: true,
					farmImages: true,
					products: true,
					orders: true,
					reviews: true,
					verificationDocument: {
						include: {
							image: true
						}
					}
				}
			}
		}
	})
}

export const getUserByEmail = async (email: string) => {
	return await db.user.findUnique({
		where: {
			email: email
		},
		select: {
			id: true,
			role: true,
			isEmailVerified: true
		}
	})
}
export const createUserFarmerById = async (
	data: FarmRegistrationSchema & { userId: string }
) => {
	return await db.$transaction(async (tx) => {
		await tx.user.update({
			where: {
				id: data.userId
			},
			data: {
				name: data.user.name
			}
		})

		const farmer = await tx.farmer.create({
			data: {
				userId: data.userId,
				applicationStatus: "PENDING",
				contactNumber: data.contactNumber,
				birthDate: new Date(data.birthDate),
				address: {
					create: {
						fullAddress: data.address.fullAddress || "",
						street: data.address.street || "",
						region: data.address.region || "",
						country: data.address.country || "",
						postalCode: data.address.postalCode || "",
						latitude: data.address.latitude || 0,
						longitude: data.address.longitude || 0
					}
				},
				farmName: data.farmName,
				farmDescription: data.farmDescription,
				verificationDocument: {
					create: {
						type: data.documentVerification.type,
						image: {
							create: {
								url: data.documentVerification.image.url,
								filename: data.documentVerification.image.filename,
								size: data.documentVerification.image.size,
								mimeType: data.documentVerification.image.mimeType,
								type: "VERIFICATION"
							}
						}
					}
				}
			},
			include: {
				user: {
					select: {
						name: true
					}
				}
			}
		})

		await tx.image.createMany({
			data: data.farmImages.map((image) => ({
				url: image.url,
				filename: image.filename,
				size: image.size,
				mimeType: image.mimeType,
				type: "FARM",
				farmerId: farmer.id
			}))
		})
		return {
			...farmer
		}
	})
}

export const getUserFarmerById = async (id: string) => {
	return await db.user.findUnique({
		where: {
			id: id
		},
		select: {
			id: true,
			role: true,
			isEmailVerified: true,
			email: true,
			name: true,
			farmer: {
				include: {
					verificationDocument: {
						include: {
							image: true
						}
					},
					address: true
				}
			}
		}
	})
}

export const getUsers = async () => {
	return await db.user.findMany({
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			isEmailVerified: true,
			createdAt: true,
			image: true,
			updatedAt: true,
			profilePicture: true
		},
		orderBy: {
			createdAt: "desc"
		}
	})
}

export const getUserWithPasswordByEmail = async (email: string) => {
	return await db.user.findFirst({
		where: {
			email: email
		},
		include: {
			profilePicture: true,
			customer: {
				select: {
					id: true,
					cart: {
						select: { id: true }
					}
				}
			},
			farmer: {
				select: {
					id: true
				}
			}
		}
	})
}

export const getCustomers = async () => {
	return await db.user.findMany({
		where: {
			role: "CUSTOMER"
		},
		select: {
			id: true,
			createdAt: true,
			updatedAt: true,
			name: true,
			email: true,
			role: true,
			profilePicture: true,
			_count: true,
			isEmailVerified: true,
			emailVerified: true,
			customer: {
				include: {
					address: true,
					_count: {
						select: {
							orders: true,
							reviews: true,
							wishlist: true
						}
					}
				}
			}
		}
	})
}

export const getTotalUsers = async () => {
	return await db.user.count()
}
export const getTotalUsersByDate = async (date: Date) => {
	return await db.user.count({
		where: {
			createdAt: {
				gte: date
			}
		}
	})
}

export const getAdminIds = async () => {
	return await db.user.findMany({
		where: {
			role: "ADMIN"
		},
		select: {
			id: true
		}
	})
}

// MARK: MUTATIONS
export const createUserWithOTP = async (
	data: RegisterSchema & {
		role: ROLE
		name: string
		emailOtp: {
			otp: string
			expiresAt: Date
		}
	}
) => {
	try {
		return await db.$transaction(async (tx) => {
			const createdUser = await tx.user.create({
				data: {
					email: data.email,
					password: data.password,
					name: data.name,
					role: data.role,
					profilePicture: {
						create: {
							url: "",
							filename: "",
							size: 0,
							mimeType: "",
							type: "PROFILE"
						}
					},
					emailOtp: {
						create: {
							email: data.email,
							expiresAt: data.emailOtp.expiresAt,
							otp: data.emailOtp.otp
						}
					}
				},
				select: {
					id: true,
					name: true,
					email: true,
					role: true,
					isEmailVerified: true,
					createdAt: true,
					image: true
				}
			})

			if (createdUser.role === "CUSTOMER") {
				const createCustomer = await tx.customer.create({
					data: {
						userId: createdUser.id
					},
					select: { id: true }
				})

				await tx.cart.create({
					data: { customerId: createCustomer.id }
				})
			}

			return createdUser
		})
	} catch (error) {
		throw error
	}
}

export const updateVerifiedUser = async (userId: string) => {
	return await db.user.update({
		where: { id: userId },
		data: {
			isEmailVerified: true
		},
		select: {
			isEmailVerified: true,
			role: true
		}
	})
}

export const updateUserPasswordByEmail = async (data: {
	email: string
	password: string
}) => {
	await db.user.update({
		where: { email: data.email },
		data: {
			password: data.password
		}
	})
}

export const updateUser = async (data: UpdateUserTypes & { id: string }) => {
	await db.user.update({
		where: {
			id: data.id
		},
		data: {
			name: data.name,
			email: data.email as string,
			isEmailVerified: data.isEmailVerified,
			image: data.image,
			role: data.role,
			...(data.password && { password: data.password })
		}
	})
}

export const deleteUserById = async (id: string) => {
	return await db.user.delete({
		where: {
			id: id
		}
	})
}
export const deleteUsersById = async (ids: string[]) => {
	return await db.$transaction([
		db.user.deleteMany({ where: { id: { in: ids } } })
	])
}

export const updateAdminUser = async (
	data: EditUserSchema & {
		userId: string
	}
) => {
	return await db.user.update({
		where: {
			id: data.userId
		},
		data: {
			name: data.name,
			email: data.email as string,
			isEmailVerified: data.isEmailVerified,
			role: data.role,
			...(data.password && { password: data.password })
		}
	})
}
