import { FarmRegistrationSchema } from "@/app/(auth)/(farmer)/farmer-registration/types"
import { RegisterSchema } from "@/app/(auth)/signup/_types"
import { UpdateUserTypes } from "@/app/dashboard/(admin)/users/(lists)/types"
import {
	createUserFarmerById,
	createUserWithOTP,
	deleteUserById,
	deleteUsersById,
	getCustomers,
	getUserByEmail,
	getUserById,
	getUserFarmerById,
	getUsers,
	getUserWithPasswordByEmail,
	updateUser,
	updateUserPasswordByEmail,
	updateVerifiedUser
} from "@/data-access/users"
import { ROLE } from "@prisma/client"

export const getUserByIdUseCase = async (id: string) => {
	return await getUserById(id)
}

export const getUserByEmailUseCase = async (email: string) => {
	return await getUserByEmail(email)
}

export const getUserFarmerByIdUseCase = async (id: string) => {
	return await getUserFarmerById(id)
}

export const getUserWithPasswordByEmailUseCase = async (email: string) => {
	return await getUserWithPasswordByEmail(email)
}

export const getCustomersUseCase = async () => {
	return await getCustomers()
}

// MARK: MUTATIONS
export const createUserFarmerByIdUseCase = async (
	data: FarmRegistrationSchema & { userId: string }
) => {
	return await createUserFarmerById(data)
}
export const createUserWithOTPUseCase = async (
	data: RegisterSchema & {
		name: string
		role: ROLE
		emailOtp: {
			otp: string
			expiresAt: Date
		}
	}
) => {
	return await createUserWithOTP(data)
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
