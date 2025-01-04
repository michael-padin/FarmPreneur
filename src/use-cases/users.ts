import { FarmRegistrationSchema } from "@/app/(auth)/(farmer)/farmer-registration/types"
import { RegisterSchema } from "@/app/(auth)/signup/_types"
import { UpdateUserTypes } from "@/app/dashboard/(admin)/users/(lists)/types"
import { EditUserSchema } from "@/app/dashboard/(admin)/users/[id]/edit/validations"
import {
	createUserFarmerById,
	createUserWithOTP,
	deleteUsersById,
	getCustomers,
	getTotalUsers,
	getTotalUsersByDate,
	getUserByEmail,
	getUserById,
	getUserFarmerById,
	getUsers,
	getUserWithPasswordByEmail,
	updateAdminUser,
	updateUser,
	updateUserPasswordByEmail,
	updateVerifiedUser
} from "@/data-access/users"
import { ROLE } from "@prisma/client"

export const getUserByIdUseCase = async (id: string) => {
	const user = await getUserById(id)
	if (!user) throw new Error("User not found!")
	return user
}

export const getUserByEmailUseCase = async (email: string) => {
	return await getUserByEmail(email)
}

export const getUserFarmerByIdUseCase = async (id: string) => {
	const foundFarmer = await getUserFarmerById(id)

	if (!foundFarmer) throw new Error("Farmer not found!")

	return foundFarmer
}

export const getUserWithPasswordByEmailUseCase = async (email: string) => {
	const user = await getUserWithPasswordByEmail(email)
	if (!user) throw new Error("User not found!")
	const profilePicture =
		user.role === "CUSTOMER"
			? user.customer?.profilePicture || ""
			: user.farmer?.profilePicture || ""

	return {
		...user,
		profilePicture
	}
}

export const getCustomersUseCase = async () => {
	return await getCustomers()
}

export const getTotalUsersUseCase = async () => {
	const currentDate = new Date()
	const lastMonthDate = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth() - 1,
		1
	)
	try {
		const totalUsers = await getTotalUsers()
		const increaseChange =
			totalUsers - (await getTotalUsersByDate(lastMonthDate))
		return { totalUsers, increaseChange }
	} catch (error) {
		throw error
	}
}
// MARK: MUTATIONS
export const createUserFarmerByIdUseCase = async (
	data: FarmRegistrationSchema & {
		userId: string
		newGovIdImage?: string
		newSelfieWithGovIdImage?: string
	}
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
	try {
		return await createUserWithOTP(data)
	} catch (error) {
		throw error
	}
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

export const deleteUsersByIdUseCase = async (ids: string[]) => {
	return await deleteUsersById(ids)
}
export const updateAdminUserUseCase = async (
	data: EditUserSchema & {
		userId: string
	}
) => {
	return await updateAdminUser(data)
}
