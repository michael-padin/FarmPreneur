"use server"
import { AuthError } from "next-auth"
import { z } from "zod"

import { signIn } from "@/auth"

import { getErrorMessage } from "@/lib/handle-error"
import { getUserByEmailUseCase } from "@/use-cases/users"
import { LoginSchema } from "./_types"

export const signInWithCredentials = async (
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
			password,
			redirect: false
		})

		const user = await getUserByEmailUseCase(email)

		return { success: "Logged in", data: user }
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: "Invalid credentials" }
				default:
					return { error: getErrorMessage(error.cause?.err) }
			}
		}

		throw error
	}
}
