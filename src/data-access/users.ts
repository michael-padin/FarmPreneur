import { RegisterFarmerSchema } from "@/app/(auth)/register-farmer/types"
import { RegisterType } from "@/app/(auth)/signup/_types"
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
			isEmailVerified: true,
			createdAt: true,
			image: true,
			updatedAt: true,
			profilePicture: true
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
			updatedAt: true
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
			profilePicture: true
		}
	})
}

// MARK: MUTATIONS
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
			image: true
		}
	})
}
export const createUserFarmer = async (data: RegisterFarmerSchema) => {
	return await db.user.create({
		data: {
			email: data.email,
			password: data.password,
			name: `${data.firstName} ${data.lastName}`,
			role: "FARMER"
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
