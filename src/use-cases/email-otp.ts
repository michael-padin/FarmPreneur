import {
	createEmailOtp,
	deleteEmailOtpByEmail,
	deleteEmailOtpById,
	deleteEmailOtpByUserId,
	deleteExpiredEmailOtps,
	getEmailOtpByEmail,
	getEmailOtpById,
	getEmailOtpByUserId,
	getEmailOtpExpirationByUserId,
	getValidEmailOtp,
	updateEmailOtp,
	updateEmailOtpExpiration
} from "@/data-access/email-otp"
import { EmailOtp } from "@prisma/client"

export const getEmailOtpByIdUseCase = async (id: string) => {
	return await getEmailOtpById(id)
}

export const createEmailOtpUseCase = async (
	data: EmailOtp & { userId: string }
) => {
	return await createEmailOtp(data)
}

export const updateEmailOtpUseCase = async (
	data: EmailOtp & { id: string }
) => {
	return await updateEmailOtp(data)
}

export const deleteEmailOtpByIdUseCase = async (id: string) => {
	return await deleteEmailOtpById(id)
}

export const getEmailOtpByEmailUseCase = async (email: string) => {
	return await getEmailOtpByEmail(email)
}
export const deleteEmailOtpByEmailUseCase = async (email: string) => {
	return await deleteEmailOtpByEmail(email)
}
export const getEmailOtpByUserIdUseCase = async (userId: string) => {
	return await getEmailOtpByUserId(userId)
}

export const deleteEmailOtpByUserIdUseCase = async (userId: string) => {
	return await deleteEmailOtpByUserId(userId)
}

export const getValidEmailOtpUseCase = async (
	email: string,
	userId: string
) => {
	return await getValidEmailOtp(email, userId)
}

export const getEmailOtpExpirationByUserIdUseCase = async (userId: string) => {
	return await getEmailOtpExpirationByUserId(userId)
}

export const deleteExpiredEmailOtpsUseCase = async () => {
	return await deleteExpiredEmailOtps()
}

export const updateEmailOtpExpirationUseCase = async (
	id: string,
	newExpirationDate: Date
) => {
	return await updateEmailOtpExpiration(id, newExpirationDate)
}

export const countActiveOtpsByUserIdUseCase = async (userId: string) => {
	return await getEmailOtpByUserId(userId)
}
