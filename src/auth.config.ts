import { compare } from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import { type Provider } from "next-auth/providers"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

import { LoginSchema } from "./types"
import { getUserWithPasswordByEmailUseCase } from "./use-cases/users"

const providers: Provider[] = [
	Credentials({
		async authorize(credentials) {
			const validateFields = LoginSchema.safeParse(credentials)

			if (!validateFields.success) return null

			const { email, password } = validateFields.data
			const user = await getUserWithPasswordByEmailUseCase(email)

			if (!user || !user.password) return null

			// compare the actual password and the hash password
			const passwordMatch = await compare(password, user.password)
			if (!passwordMatch) return null

			const newUser = {
				id: user.id,
				role: user.role,
				profilePicture: user.profilePicture
			}
			return newUser
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
		async jwt({ token, account, user }) {
			if (account && account.type === "credentials") {
				token.userId = account.providerAccountId
			}

			token.role = user.role
			token.profilePicture = user.profilePicture || ""

			return token
		},
		async session({ session, token }) {
			return {
				...session,
				user: {
					id: token.userId,
					role: token.role,
					profilePicture: token.profilePicture
				}
			}
		}
	},
	secret: process.env.AUTH_SECRET
} satisfies NextAuthConfig
