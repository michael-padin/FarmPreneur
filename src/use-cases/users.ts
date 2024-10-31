import { RegisterFarmerType } from "@/app/(auth)/register-farmer/types"
import { RegisterType } from "@/app/(auth)/signup/_types"
import { UpdateUserTypes } from "@/app/dashboard/(admin)/users/(lists)/types"
import {
	createUserCustomer,
	createUserFarmer,
	deleteUserById,
	deleteUsersById,
	getCustomers,
	getFarmers,
	getPendingFarmers,
	getUserByEmail,
	getUserById,
	getUserFarmerById,
	getUsers,
	getUserWithPasswordByEmail,
	saveVerificationCode,
	updateUser,
	updateUserPasswordByEmail,
	updateVerifiedUser
} from "@/data-access/users"
import {
	transformCustomerRecord,
	transformFarmerRecord
} from "@/utils/transform"

export const getUserByIdUseCase = async (id: string) => {
	return await getUserById(id)
}

export const getUserByEmailUseCase = async (email: string) => {
	return await getUserByEmail(email)
}
export const getUserWithPasswordByEmailUseCase = async (email: string) => {
	return await getUserWithPasswordByEmail(email)
}

export const getUserFarmerByIdUseCase = async (id: string) => {
	return await getUserFarmerById(id)
}

export const createUserCustomerUseCase = async (
	data: RegisterType & { name: string }
) => {
	return await createUserCustomer(data)
}

export const createUserFarmerUseCase = async (data: RegisterFarmerType) => {
	return await createUserFarmer(data)
}

export const saveVerificationCodeUseCase = async (data: {
	userId: string
	code: string
	expirationTime: Date
	email: string
}) => {
	return await saveVerificationCode(data)
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
	const farmers = await getFarmers()
	return farmers.map(transformFarmerRecord)
}
export const getPendingFarmersUseCase = async () => {
	return await getPendingFarmers()
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
