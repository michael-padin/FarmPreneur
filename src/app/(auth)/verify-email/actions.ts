"use server"
import {
	getUserByIdUseCase,
	saveVerificationCodeUseCase,
	updateVerifiedUserUseCase
} from "@/use-cases/users"
import {
	generateExpiration,
	generateOTP
} from "@/utils/generateVerificationCode"
import { sendOTPEmail } from "@/lib/nodemailer"
import { VerificationFormSchema, VerificationType } from "./types"
import {
	deleteEmailOtpByEmailUseCase,
	getEmailOtpByEmailUseCase
} from "@/use-cases/email-otp"
import { getErrorMessage } from "@/lib/handle-error"
import { isOtpExpired } from "@/lib/utils"

export const verifyCode = async (
	data: VerificationType & { userId: string; email: string }
) => {
	const parsedData = VerificationFormSchema.safeParse(data)
	if (!parsedData.success) {
		return { error: "Invalid fields" }
	}
	console.log("DATA HERE")

	console.log({ data })

	try {
		const [otp, user] = await Promise.all([
			getEmailOtpByEmailUseCase(data.email),
			getUserByIdUseCase(data.userId)
		])
		// Check if OTP matches and is still valid
		if (otp) {
			if (!isOtpExpired(otp?.expiresAt)) {
				if (otp.otp !== data.code) {
					return { error: "Invalid code" }
				}
				const [verifiedUser, _] = await Promise.all([
					updateVerifiedUserUseCase(user!.id),
					deleteEmailOtpByEmailUseCase(data.email)
				])
				return { success: "Email verified", data: verifiedUser }
			} else {
				await deleteEmailOtpByEmailUseCase(data.email)
				return {
					error: "Invalid code, OTP has expired"
				}
			}
		}
		return { error: "Invalid code" }
	} catch (error) {
		console.log(error)

		return { error: getErrorMessage(error) }
	}
}

export const resendCode = async (userId: string) => {
	try {
		const user = await getUserByIdUseCase(userId)
		if (!user) return { error: "User not found" }

		await deleteEmailOtpByEmailUseCase(user.email)

		const otp = generateOTP()
		const otpExpiration = generateExpiration(5)

		const response = await saveVerificationCodeUseCase({
			userId,
			code: otp,
			email: user.email,
			expirationTime: otpExpiration
		})

		// Send verification email
		await sendOTPEmail(user.email!, otp, "FarmPreneur", user.name!)

		return { success: "Verification email sent", data: response }
	} catch (error) {
		if (error instanceof Error) return { error: error.message }
		return { error: "Error sending verification email" }
	}
}
