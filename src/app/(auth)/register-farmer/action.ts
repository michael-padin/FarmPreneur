"use server"

import { hash } from "bcryptjs"
import {
	generateExpiration,
	generateOTP
} from "@/utils/generateVerificationCode"
import {
	createUserWithOTPUseCase,
	getUserByEmailUseCase
} from "@/use-cases/users"
import { sendOTPEmail } from "@/lib/nodemailer"
import { getErrorMessage } from "@/lib/handle-error"
import { signIn } from "@/auth"
import { RegisterSchema } from "@/validations/user"

export const registerFarmer = async (data: RegisterSchema) => {
	try {
		const hashedPassword = await hash(data.password, 10)

		const existingUser = await getUserByEmailUseCase(data.email)
		if (existingUser) return { error: "User already exists", data: null }

		const otp = generateOTP()
		const otpExpiration = generateExpiration(1)

		const newUser = await createUserWithOTPUseCase({
			...data,
			name: `${data.firstName} ${data.lastName}`,
			role: "FARMER",
			password: hashedPassword,
			emailOtp: {
				otp,
				expiresAt: otpExpiration
			}
		})
		await sendOTPEmail(newUser.email!, otp, "FarmPreneur", newUser.name!)

		await signIn("credentials", {
			email: data.email,
			password: data.password,
			redirect: false
		})
		return {
			error: null,
			data: null
		}
	} catch (error) {
		console.log(error)
		return {
			error: getErrorMessage(error),
			data: null
		}
	}
}
