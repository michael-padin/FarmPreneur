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

export const verifyCode = async (data: VerificationType) => {
	const parsedData = VerificationFormSchema.safeParse(data)
	if (!parsedData.success) {
		return { error: "Invalid fields" }
	}
	try {
		const user = await getUserByIdUseCase(data.userId)
		// Check if OTP matches and is still valid
		const now = new Date()
		if (
			user?.verificationCode === data.code &&
			user!.verificationExpires! > now
		) {
			await updateVerifiedUserUseCase(user!.id)
		}
		return { success: "Email verified" }
	} catch (error) {
		if (error instanceof Error) return { error: error.message }
		return { error: "Error verifying code" }
	}
}

export const resendCode = async (userId: string) => {
	try {
		const user = await getUserByIdUseCase(userId)
		if (!user) return { error: "User not found" }

		const otp = generateOTP()
		const otpExpiration = generateExpiration()

		await saveVerificationCodeUseCase(userId, otp, otpExpiration)

		// Send verification email
		await sendOTPEmail(user.email!, otp, "FarmPreneur", user.name!)

		return { success: "Verification email sent" }
	} catch (error) {
		if (error instanceof Error) return { error: error.message }
		return { error: "Error sending verification email" }
	}
}
