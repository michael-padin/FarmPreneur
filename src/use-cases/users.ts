import {
	createUserCustomer,
	getUserByEmail,
	getUserById,
	getUserFarmerById,
	saveVerificationCode,
	updateVerifiedUser
} from "@/data-access/users"

export const getUserByIdUseCase = async (id: string) => {
	return await getUserById(id)
}

export const getUserByEmailUseCase = async (email: string) => {
	const user = await getUserByEmail(email)
	const { password, ...newUser } = user!
	return newUser
}

export const getUserFarmerByIdUseCase = async (id: string) => {
	return await getUserFarmerById(id)
}

export const createUserCustomerUseCase = async (data: {
	email: string
	password: string
	name: string
}) => {
	const user = await createUserCustomer(data)
	const { password, ...newUser } = user!
	return newUser
}

export const saveVerificationCodeUseCase = async (
	userId: string,
	otp: string,
	expirationTime: Date
) => {
	return await saveVerificationCode(userId, otp, expirationTime)
}

export const updateVerifiedUserUseCase = async (userId: string) => {
	return await updateVerifiedUser(userId)
}
