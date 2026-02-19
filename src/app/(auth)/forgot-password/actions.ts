"use server"
import {
	buildRateLimitErrorMessage,
	checkRateLimit,
	getClientIdentifier
} from "@/lib/rate-limit"
import { sendResetPasswordEmail } from "@/lib/nodemailer"
import jwt from "jsonwebtoken"
import { headers } from "next/headers"
import { ForgotPasswordSchema, ForgotPasswordType } from "./types"

export const sendPasswordResetEmail = async (data: ForgotPasswordType) => {
	const parsedData = ForgotPasswordSchema.safeParse(data)

	if (!parsedData.success) {
		return { error: "Invalid fields" }
	}

	try {
		const requestHeaders = await headers()
		const rateLimitResult = await checkRateLimit({
			namespace: "action-forgot-password",
			identifier: getClientIdentifier(requestHeaders),
			limit: 4,
			windowMs: 15 * 60_000
		})

		if (!rateLimitResult.allowed) {
			return {
				error: buildRateLimitErrorMessage(rateLimitResult.retryAfterSeconds)
			}
		}

		const token = jwt.sign({ email: data.email }, process.env.JWT_SECRET!, {
			expiresIn: "1h"
		})

		const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`

		await sendResetPasswordEmail(data.email, data.email, resetLink)

		return { success: "Email sent" }
	} catch (error) {
		if (error instanceof Error) {
			console.log(error.message)
		}
		throw error
	}
}
