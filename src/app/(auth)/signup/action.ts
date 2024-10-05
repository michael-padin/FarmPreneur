"use server"
import { hash } from "bcryptjs"

import { getUserByEmail } from "@/services/user"

import { RegisterSchema, RegisterType } from "./_types"
import { createUserCustomerUseCase } from "@/use-cases/users"

export const register = async (data: RegisterType) => {
	const parsedData = RegisterSchema.safeParse(data)

	if (!parsedData.success) {
		return { error: "Invalid fields" }
	}

	// const { email, password, name, address, description, mobileNumber, role } =
	//   parsedData.data
	const { email, password } = parsedData.data

	try {
		const hashedPassword = await hash(password, 10)

		const existingUser = await getUserByEmail(email)
		if (existingUser) return { error: "User already exists" }

		await createUserCustomerUseCase({
			...data,
			name: `${data.firstName} ${data.lastName}`,
			password: hashedPassword
		})

		return { success: "User created" }
		/**
		 * @todo Send email to user for verification
		 */
	} catch (error) {
		if (error instanceof Error) console.log(error.message)
		return { error: "Error creating user" }
	}
}

// export const sigInWithGoogle = async () => await signIn("google");
