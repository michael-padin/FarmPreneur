import { UpdateUserTypes } from "@/app/dashboard/(admin)/users/(lists)/types"
import { db } from "@/lib/db"

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
			farmerApproval: true,
			verificationCode: true,
			verificationExpires: true,
			isVerified: true,
			createdAt: true,
			image: true,
			contactNumber: true,
			Address: true,
			updatedAt: true,
			products: true,
			buyerOrders: true,
			farmerOrders: true,
			farmDetails: true
		},
		cacheStrategy: { ttl: 60 }
	})
}

export const getUserByEmail = async (email: string) => {
	return await db.user.findUnique({
		where: {
			email: email
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
			farmDetails: true
		}
	})
}

export const createUserCustomer = async (data: {
	email: string
	password: string
	name: string
}) => {
	return await db.user.create({
		data: {
			email: data.email,
			password: data.password,
			name: data.name,
			role: "CUSTOMER"
		}
	})
}

export const saveVerificationCode = async (
	userId: string,
	code: string,
	expirationTime: Date
) => {
	await db.user.update({
		where: { id: userId },
		data: {
			verificationCode: code,
			verificationExpires: expirationTime
		}
	})
}

export const updateVerifiedUser = async (userId: string) => {
	await db.user.update({
		where: { id: userId },
		data: {
			isVerified: true,
			verificationCode: null,
			verificationExpires: null
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
			farmerApproval: true,
			isVerified: true,
			createdAt: true,
			image: true,
			contactNumber: true,
			Address: true,
			updatedAt: true
		},
		orderBy: {
			createdAt: "desc"
		},
		cacheStrategy: {
			swr: 60,
			ttl: 60
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
			email: data.email,
			isVerified: data.isVerified,
			contactNumber: data.contactNumber,
			image: data.image,
			farmerApproval: data.farmerApproval,
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
			farmerApproval: true,
			products: true,
			isVerified: true,
			createdAt: true,
			image: true,
			contactNumber: true,
			Address: true,
			updatedAt: true,
			_count: true
		},
		orderBy: {
			createdAt: "desc"
		},
		cacheStrategy: {
			swr: 60,
			ttl: 60
		}
	})
}
export const getPendingFarmers = async () => {
	return await db.user.findMany({
		where: {
			role: "FARMER",
			farmerApproval: "PENDING"
		},
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			farmDetails: true,
			farmerOrders: true,
			farmerApproval: true,
			products: true,
			isVerified: true,
			createdAt: true,
			image: true,
			contactNumber: true,
			Address: true,
			updatedAt: true,
			_count: true
		},
		orderBy: {
			createdAt: "desc"
		},
		cacheStrategy: {
			swr: 60,
			ttl: 60
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
			isVerified: true,
			createdAt: true,
			image: true,
			contactNumber: true,
			Address: true,
			updatedAt: true,
			_count: true
		},
		orderBy: {
			createdAt: "desc"
		},
		cacheStrategy: {
			swr: 60,
			ttl: 60
		}
	})
}
