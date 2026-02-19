"use server"
import { signIn } from "@/auth"
import { getErrorMessage } from "@/lib/handle-error"
import { sendOTPEmail } from "@/lib/nodemailer"
import {
	buildRateLimitErrorMessage,
	checkRateLimit,
	getClientIdentifier
} from "@/lib/rate-limit"
import {
	createUserWithOTPUseCase,
	getUserByEmailUseCase
} from "@/use-cases/users"
import {
	generateExpiration,
	generateOTP
} from "@/utils/generateVerificationCode"
import { hash } from "bcryptjs"
import { headers } from "next/headers"
import { RegisterSchema } from "./_types"

export const register = async (data: RegisterSchema) => {
	try {
		const requestHeaders = await headers()
		const rateLimitResult = await checkRateLimit({
			namespace: "action-signup",
			identifier: getClientIdentifier(requestHeaders),
			limit: 6,
			windowMs: 15 * 60_000
		})

		if (!rateLimitResult.allowed) {
			return {
				error: buildRateLimitErrorMessage(rateLimitResult.retryAfterSeconds),
				data: null
			}
		}

		const hashedPassword = await hash(data.password, 10)

		const existingUser = await getUserByEmailUseCase(data.email)
		if (existingUser) return { error: "User already exists", data: null }

		const otp = generateOTP()
		const otpExpiration = generateExpiration(5)

		const newUser = await createUserWithOTPUseCase({
			...data,
			name: `${data.firstName} ${data.lastName}`,
			role: "CUSTOMER",
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
		return { error: getErrorMessage(error), data: null }
	}
}
