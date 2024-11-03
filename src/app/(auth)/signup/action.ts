"use server"
import { RegisterSchema, RegisterType } from "./_types"
import { hash } from "bcryptjs"
import {
	generateExpiration,
	generateOTP
} from "@/utils/generateVerificationCode"
import {
	createUserCustomerUseCase,
	getUserByEmailUseCase,
	saveVerificationCodeUseCase
} from "@/use-cases/users"
import { sendOTPEmail } from "@/lib/nodemailer"
import { getErrorMessage } from "@/lib/handle-error"
import { signIn } from "@/auth"

export const register = async (data: RegisterType) => {
	try {
		const hashedPassword = await hash(data.password, 10)

		const existingUser = await getUserByEmailUseCase(data.email)
		if (existingUser) return { error: "User already exists", data: null }

		const newUser = await createUserCustomerUseCase({
			...data,
			name: `${data.firstName} ${data.lastName}`,
			password: hashedPassword
		})

		const otp = generateOTP()
		const otpExpiration = generateExpiration(1)

		console.log("Saving verification code...")
		await saveVerificationCodeUseCase({
			code: otp,
			expirationTime: otpExpiration,
			userId: newUser.id,
			email: newUser.email
		})

		console.log(`Sending otp to ${data.email}`)
		// await sendOTPEmail(newUser.email!, otp, "FarmPreneur", newUser.name!)

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
