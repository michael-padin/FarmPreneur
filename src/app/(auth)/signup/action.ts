"use server"
import { hash } from "bcryptjs"

import {
	generateExpiration,
	generateOTP
} from "@/utils/generateVerificationCode"
import { getUserByEmail } from "@/services/user"
import { RegisterSchema, RegisterType } from "./_types"
import {
	createUserCustomerUseCase,
	saveVerificationCodeUseCase
} from "@/use-cases/users"
import { sendOTPEmail } from "@/lib/nodemailer"
import { revalidatePath } from "next/cache"

export const register = async (data: RegisterType) => {
	const parsedData = RegisterSchema.safeParse(data)

	if (!parsedData.success) {
		return { error: "Invalid fields" }
	}

	const { email, password } = parsedData.data

	try {
		const hashedPassword = await hash(password, 10)

		const existingUser = await getUserByEmail(email)
		if (existingUser) return { error: "User already exists" }

		const newUser = await createUserCustomerUseCase({
			name: `${data.firstName} ${data.lastName}`,
			email,
			password: hashedPassword
		})

		if (!newUser) return { error: "Error creating user" }

		/**
		 * @todo Send email to user for verification
		 */
		// Generate OTP and expiration (e.g., 5 minutes)
		const otp = generateOTP()
		const otpExpiration = generateExpiration()

		console.log("Saving verification code...")
		await saveVerificationCodeUseCase(newUser.id, otp, otpExpiration)

		await sendOTPEmail(newUser.email!, otp, "FarmPreneur", newUser.name!)

		revalidatePath("/dashboard/users")

		return {
			success: "Account created, please check your email",
			data: {
				userId: newUser.id
			}
		}
	} catch (error) {
		if (error instanceof Error) {
			console.log(error.message)
			return { error: error.message }
		}
		throw error
	}
}
