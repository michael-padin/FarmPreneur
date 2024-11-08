import { RegisterFarmerSchema } from "@/app/(auth)/register-farmer/types"
import { RegisterType } from "@/app/(auth)/signup/_types"
import { UpdateUserTypes } from "@/app/dashboard/(admin)/users/(lists)/types"
import {
	createUserCustomer,
	createUserFarmer,
	deleteUserById,
	deleteUsersById,
	getUserByEmail,
	getUserById,
	getUsers,
	getUserWithPasswordByEmail,
	updateUser,
	updateUserPasswordByEmail,
	updateVerifiedUser
} from "@/data-access/users"

export const getUserByIdUseCase = async (id: string) => {
	return await getUserById(id)
}

export const getUserByEmailUseCase = async (email: string) => {
	return await getUserByEmail(email)
}
export const getUserWithPasswordByEmailUseCase = async (email: string) => {
	return await getUserWithPasswordByEmail(email)
}

export const createUserCustomerRole = async (
	data: RegisterType & { name: string }
) => {
	return await createUserCustomer(data)
}

export const createUserFarmerUseCase = async (data: RegisterFarmerSchema) => {
	return await createUserFarmer(data)
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
