import {
	createEmailOtp,
	deleteEmailOtpByEmail,
	getEmailOtpByEmail,
	getEmailOtpExpirationByUserId
} from "@/data-access/email-otp"

export const getEmailOtpByEmailUseCase = async (email: string) => {
	return await getEmailOtpByEmail(email)
}
export const deleteEmailOtpByEmailUseCase = async (email: string) => {
	return await deleteEmailOtpByEmail(email)
}

export const getEmailOtpExpirationByUserIdUseCase = async (userId: string) => {
	return await getEmailOtpExpirationByUserId(userId)
}

export const createEmailOtpUseCase = async (data: {
	userId: string
	otp: string
	expiresAt: Date
	email: string
}) => {
	return await createEmailOtp(data)
}
