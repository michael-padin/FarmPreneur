"use server"
import { RegisterSchema, RegisterType } from "./_types"
import { hash } from "bcryptjs"
import {
	generateExpiration,
	generateOTP
} from "@/utils/generateVerificationCode"
import { getUserByEmail } from "@/services/user"
import {
	createUserCustomerUseCase,
	saveVerificationCodeUseCase
} from "@/use-cases/users"
import { sendOTPEmail } from "@/lib/nodemailer"
import { getErrorMessage } from "@/lib/handle-error"

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
			...data,
			name: `${data.firstName} ${data.lastName}`,
			password: hashedPassword
		})

		if (!newUser) return { error: "Error creating user" }

		const otp = generateOTP()
		const otpExpiration = generateExpiration(5)

		console.log("Saving verification code...")
		await saveVerificationCodeUseCase({
			code: otp,
			expirationTime: otpExpiration,
			userId: newUser.id,
			email: newUser.email
		})

		await sendOTPEmail(newUser.email!, otp, "FarmPreneur", newUser.name!)
		return {
			error: null,
			data: {
				userId: newUser.id
			}
		}
	} catch (error) {
		console.log(error)
		return { error: getErrorMessage(error) }
	}
}
