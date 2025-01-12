"use server"
import { auth, unstable_update } from "@/auth"
import { getErrorMessage } from "@/lib/handle-error"
import { sendOTPEmail } from "@/lib/nodemailer"
import { isOtpExpired } from "@/lib/utils"
import {
	createEmailOtpUseCase,
	deleteEmailOtpByEmailUseCase,
	getEmailOtpByEmailUseCase
} from "@/use-cases/email-otp"
import {
	getUserByIdUseCase,
	updateVerifiedUserUseCase
} from "@/use-cases/users"
import {
	generateExpiration,
	generateOTP
} from "@/utils/generateVerificationCode"
import { VerificationFormSchema, VerificationType } from "./types"

export const verifyCode = async (
	data: VerificationType & { userId: string; email: string }
) => {
	const session = await auth()

	if (!session?.user) throw new Error("Unauthorized")

	try {
		const validations = VerificationFormSchema.safeParse(data)

		if (!validations.success) {
			throw new Error("Invalid fields")
		}
		const [otp, user] = await Promise.all([
			getEmailOtpByEmailUseCase(data.email),
			getUserByIdUseCase(data.userId)
		])

		// Check if OTP matches and is still valid
		if (otp) {
			if (!isOtpExpired(otp?.expiresAt)) {
				if (otp.otp !== data.code) {
					throw new Error("Invalid code")
				}
				const [verifiedUser, _] = await Promise.all([
					updateVerifiedUserUseCase(user!.id),
					deleteEmailOtpByEmailUseCase(data.email)
				])

				await unstable_update({
					user: {
						...session.user,
						isEmailVerified: verifiedUser.isEmailVerified
					}
				})
				return { success: "Email verified", data: verifiedUser }
			} else {
				await deleteEmailOtpByEmailUseCase(data.email)
				throw new Error("Invalid code, OTP has expired")
			}
		}
		throw new Error("Invalid code")
	} catch (error) {
		console.error(error)
		return { error: getErrorMessage(error) }
	}
}

export const resendCode = async (userId: string) => {
	try {
		const user = await getUserByIdUseCase(userId)
		if (!user) throw new Error("User not found")

		await deleteEmailOtpByEmailUseCase(user.email)

		const otp = generateOTP()
		const expiresAt = generateExpiration(5)

		const response = await createEmailOtpUseCase({
			userId,
			expiresAt,
			otp: otp,
			email: user.email
		})

		await sendOTPEmail(user.email!, otp, "FarmPreneur", user.name!)

		return { success: "Verification email sent", data: response }
	} catch (error) {
		console.error(error)
		return { error: getErrorMessage(error) }
	}
}
