import { compare } from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import { type Provider } from "next-auth/providers"
import Google from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

import { getUserByEmail } from "./services/user"
import { LoginSchema } from "./types"

const providers: Provider[] = [
	CredentialsProvider({
		async authorize(credentials) {
			const validateFields = LoginSchema.safeParse(credentials)

			if (validateFields.success) {
				const { email, password } = validateFields.data
				const user = await getUserByEmail(email)

				/**
				 * if user is not found or if there is user but password is not provided
				 * but using credentials provider, return null
				 */
				if (!user || !user.password) return null

				// compare the actual password and the hash password
				const passwordMatch = await compare(password, user.password)

				const {
					password: _,
					emailVerified,
					createdAt,
					updatedAt,
					...newUser
				} = user

				if (passwordMatch) return newUser
			}
			return null
		}
	}),
	Google({
		clientId: process.env.AUTH_GOOGLE_ID,
		clientSecret: process.env.AUTH_GOOGLE_SECRET
	})
]

export default {
	providers,
	debug: process.env.NODE_ENV === "development",
	pages: {
		signIn: "/login"
	},
	callbacks: {
		session({ session, user }) {
			session.user.id = ""
			return session
		}
	},
	secret: process.env.AUTH_SECRET
} satisfies NextAuthConfig
