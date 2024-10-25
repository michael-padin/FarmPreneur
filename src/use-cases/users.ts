import { UpdateUserTypes } from "@/app/dashboard/(admin)/users/(lists)/types"
import {
	createUserCustomer,
	deleteUserById,
	deleteUsersById,
	getCustomers,
	getFarmers,
	getUserByEmail,
	getUserById,
	getUserFarmerById,
	getUsers,
	saveVerificationCode,
	updateUser,
	updateUserPasswordByEmail,
	updateVerifiedUser
} from "@/data-access/users"
import { transformCustomerRecord } from "@/utils/transform"

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

export const UpdateUserPasswordByEmailUseCase = async (data: {
	email: string
	password: string
}) => {
	return await updateUserPasswordByEmail(data)
}

export const getUsersUseCase = async () => {
	return await getUsers()
}
export const getFarmersUseCase = async () => {
	return await getFarmers()
}
export const getCustomersUseCase = async () => {
	const customers = await getCustomers()
	return customers.map(transformCustomerRecord)
}

export const updateUserUseCase = async (
	data: UpdateUserTypes & { id: string }
) => {
	return await updateUser(data)
}

export const deleteUserByIdUseCase = async (id: string) => {
	return await deleteUserById(id)
}
export const deleteUsersByIdUseCase = async (ids: string[]) => {
	return await deleteUsersById(ids)
}
