"use server"
import jwt, { JwtPayload } from "jsonwebtoken"
import bcrypt from "bcryptjs"

import { NewPasswordFormSchema, NewPasswordFormType } from "./types"
import { UpdateUserPasswordByEmailUseCase } from "@/use-cases/users"

interface ResetPasswordPayload extends JwtPayload {
	email: string
}

export const createNewPassword = async (data: NewPasswordFormType) => {
	const parsedData = NewPasswordFormSchema.safeParse(data)

	if (!parsedData.success) {
		return { error: "Invalid fields" }
	}
	const { password, token } = data

	try {
		// Send a password reset email with the new password
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET!
		) as ResetPasswordPayload

		if (!decoded) {
			return { error: "Invalid token" }
		}

		const hashedPassword = await bcrypt.hash(password, 10)

		await UpdateUserPasswordByEmailUseCase({
			email: decoded.email,
			password: hashedPassword
		})

		return { success: "Password reset successfully" }
	} catch (error) {
		if (error instanceof Error) {
			console.log(error.message)
			return {
				error: "Error resetting password"
			}
		}
		throw error
	}
}
