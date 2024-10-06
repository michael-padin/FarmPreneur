import { db } from "@/lib/db"

export const getUserById = async (id: string) => {
	return await db.user.findFirst({
		where: {
			id: id
		}
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
		data
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
