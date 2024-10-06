"use server"
import jwt from "jsonwebtoken"
import { sendResetPasswordEmail } from "@/lib/nodemailer"
import { ForgotPasswordSchema, ForgotPasswordType } from "./types"

export const sendPasswordResetEmail = async (data: ForgotPasswordType) => {
	const parsedData = ForgotPasswordSchema.safeParse(data)

	if (!parsedData.success) {
		return { error: "Invalid fields" }
	}

	try {
		const token = jwt.sign({ email: data.email }, process.env.JWT_SECRET!, {
			expiresIn: "1h"
		})

		const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`

		await sendResetPasswordEmail(data.email, data.email, resetLink)

		return { success: "Email sent" }
	} catch (error) {
		if (error instanceof Error) {
			console.log(error.message)
			return {
				error: "Something went wrong"
			}
		}
		throw error
	}
}
