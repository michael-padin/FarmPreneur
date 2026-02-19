"use server"
import { AuthError } from "next-auth"
import { z } from "zod"

import { signIn } from "@/auth"

import { getErrorMessage } from "@/lib/handle-error"
import {
	buildRateLimitErrorMessage,
	checkRateLimit,
	getClientIdentifier
} from "@/lib/rate-limit"
import { getUserByEmailUseCase } from "@/use-cases/users"
import { headers } from "next/headers"
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
		const requestHeaders = await headers()
		const rateLimitResult = await checkRateLimit({
			namespace: "action-login",
			identifier: getClientIdentifier(requestHeaders),
			limit: 12,
			windowMs: 10 * 60_000
		})

		if (!rateLimitResult.allowed) {
			return {
				error: buildRateLimitErrorMessage(rateLimitResult.retryAfterSeconds)
			}
		}

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
