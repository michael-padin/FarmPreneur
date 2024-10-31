"use server"
import { AuthError } from "next-auth"
import { z } from "zod"

import { signIn } from "@/auth"

import { LoginSchema } from "./_types"
import { getUserByEmailUseCase } from "@/use-cases/users"

export const siginInWithCredentials = async (
	data: z.infer<typeof LoginSchema>
) => {
	const validatedFields = LoginSchema.safeParse(data)

	if (!validatedFields.success) {
		return { error: "Invalid fields" }
	}

	const { email, password } = validatedFields.data

	try {
		await signIn("credentials", {
			email,
			password
		})

		const user = await getUserByEmailUseCase(email)

		return { success: "Logged in", data: user }
	} catch (error) {
		// @TODO: handle error
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: "Invalid credentials" }
				default:
					return { error: "Something went wrong" }
			}
		}

		throw error
	}
}
