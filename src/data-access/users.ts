import { RegisterFarmerSchema } from "@/app/(auth)/register-farmer/types"
import { RegisterType } from "@/app/(auth)/signup/_types"
import { UpdateUserTypes } from "@/app/dashboard/(admin)/users/(lists)/types"
import { db } from "@/lib/db"
import { Turret_Road } from "next/font/google"

export const getUserById = async (id: string) => {
	return await db.user.findUnique({
		where: {
			id: id
		},
		select: {
			id: true,
			name: true,
			farmerApplicationStatus: true,
			email: true,
			role: true,
			isEmailVerified: true,
			createdAt: true,
			image: true,
			contactNumber: true,
			address: true,
			updatedAt: true,
			birthDate: true,
			profilePicture: true,
			verificationDocument: {
				select: {
					id: true,
					type: true,
					image: true,
					userId: true,
					user: true,
					createdAt: true,
					updatedAt: true
				}
			},
			farmDetails: true
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

export const getUserFarmerById = async (id: string) => {
	return await db.user.findFirst({
		where: { id: id },
		select: {
			image: true,
			id: true,
			name: true,
			contactNumber: true,
			farmDetails: true,
			farmerApplicationStatus: true,
			isEmailVerified: true
		}
	})
}
export const getUserWithPasswordByEmail = async (email: string) => {
	return await db.user.findFirst({
		where: {
			email: email
		},
		include: {
			profilePicture: true
		}
	})
}

export const createUserCustomer = async (
	data: RegisterType & { name: string }
) => {
	return await db.user.create({
		data: {
			email: data.email,
			password: data.password,
			name: data.name,
			role: "CUSTOMER"
		},
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			isEmailVerified: true,
			createdAt: true,
			image: true,
			contactNumber: true
		}
	})
}
export const createUserFarmer = async (data: RegisterFarmerSchema) => {
	return await db.user.create({
		data: {
			email: data.email,
			password: data.password,
			name: `${data.firstName} ${data.lastName}`,
			contactNumber: data.contactNumber,
			birthDate: new Date(data.birthDate),
			farmerApplicationStatus: "PENDING",
			role: "FARMER",
			address: {
				create: {
					fullAddress: data.address?.fullAddress,
					street: data.address?.street,
					region: data.address?.region,
					country: data.address?.country,
					postalCode: data.address?.postalCode,
					latitude: data.address?.latitude,
					longitude: data.address?.longitude
				}
			},
			verificationDocument: {
				create: {
					type: data.documentVerification?.type,
					image: {
						create: {
							url: data.documentVerification?.image?.url,
							filename: data.documentVerification?.image?.filename,
							size: data.documentVerification?.image?.size,
							mimeType: data.documentVerification?.image?.mimeType,
							type: "VERIFICATION"
						}
					}
				}
			}
		}
	})
}

export const saveVerificationCode = async (data: {
	userId: string
	code: string
	expirationTime: Date
	email: string
}) => {
	return await db.emailOtp.create({
		data: {
			otp: data.code,
			expiresAt: data.expirationTime,
			userId: data.userId,
			email: data.email
		},
		select: {
			expiresAt: true
		}
	})
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

export const getUsers = async () => {
	return await db.user.findMany({
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			farmerApplicationStatus: true,
			isEmailVerified: true,
			createdAt: true,
			image: true,
			contactNumber: true,
			address: true,
			updatedAt: true
		},
		orderBy: {
			createdAt: "desc"
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
			contactNumber: data.contactNumber,
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
	console.log(ids)

	return await db.$transaction([
		db.user.deleteMany({ where: { id: { in: ids } } })
	])
}

export const getFarmers = async () => {
	return await db.user.findMany({
		where: {
			role: "FARMER"
		},
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			farmDetails: true,
			farmerOrders: true,
			farmerApplicationStatus: true,
			products: true,
			isEmailVerified: true,
			createdAt: true,
			image: true,
			contactNumber: true,
			address: true,
			updatedAt: true,
			_count: true
		},
		orderBy: {
			createdAt: "desc"
		}
	})
}
export const getPendingFarmers = async () => {
	return await db.user.findMany({
		where: {
			role: "FARMER",
			farmerApplicationStatus: "PENDING"
		},
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			farmDetails: true,
			farmerOrders: true,
			farmerApplicationStatus: true,
			products: true,
			isEmailVerified: true,
			createdAt: true,
			image: true,
			contactNumber: true,
			address: true,
			updatedAt: true,
			birthDate: true,
			verificationDocument: {
				select: {
					image: true
				}
			},
			_count: true
		},
		orderBy: {
			createdAt: "desc"
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
			name: true,
			email: true,
			role: true,
			buyerOrders: true,
			isEmailVerified: true,
			createdAt: true,
			image: true,
			contactNumber: true,
			address: true,
			updatedAt: true,
			_count: true
		},
		orderBy: {
			createdAt: "desc"
		}
	})
}
