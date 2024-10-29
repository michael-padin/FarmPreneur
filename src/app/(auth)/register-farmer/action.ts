"use server"

import { getUserByEmail } from "@/services/user"

import { RegisterFarmerSchema, RegisterFarmerType } from "./types"
import { hash } from "bcryptjs"
import {
	generateExpiration,
	generateOTP
} from "@/utils/generateVerificationCode"
import {
	createUserFarmerUseCase,
	saveVerificationCodeUseCase
} from "@/use-cases/users"
import { sendOTPEmail } from "@/lib/nodemailer"
import { getErrorMessage } from "@/lib/handle-error"

export const registerFarmer = async (data: RegisterFarmerType) => {
	const { password, email } = data

	try {
		const hashedPassword = await hash(password, 10)

		const existingUser = await getUserByEmail(email)
		if (existingUser) return { error: "User already exists", data: null }

		const newFarmer = await createUserFarmerUseCase({
			...data,
			password: hashedPassword
		})

		/**
		 * @todo Send email to user for verification
		 */
		// Generate OTP and expiration (e.g., 5 minutes)
		const otp = generateOTP()
		const otpExpiration = generateExpiration()

		console.log("Saving verification code...")
		await saveVerificationCodeUseCase({
			code: otp,
			expirationTime: otpExpiration,
			userId: newFarmer.id,
			email: newFarmer.email
		})

		await sendOTPEmail(newFarmer.email!, otp, "FarmPreneur", newFarmer.name!)
		return {
			data: {
				userId: newFarmer.id
			}
		}
	} catch (error) {
		console.log(error)
		return {
			error: getErrorMessage(error),
			data: null
		}
	}
}

// export const sigInWithGoogle = async () => await signIn("google");
