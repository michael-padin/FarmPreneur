import { compare } from "bcryptjs"
import type { NextAuthConfig, Session } from "next-auth"
import { type Provider } from "next-auth/providers"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

import { LoginSchema } from "./types"
import { getUserWithPasswordByEmailUseCase } from "./use-cases/users"

const providers: Provider[] = [
	Credentials({
		async authorize(credentials) {
			const validateFields = LoginSchema.safeParse(credentials)
			if (validateFields.success) {
				const { email, password } = validateFields.data
				const user = await getUserWithPasswordByEmailUseCase(email)

				if (!user || !user.password) return null

				// compare the actual password and the hash password
				const passwordMatch = await compare(password, user.password)

				if (passwordMatch) {
					const newUser = {
						id: user.id,
						role: user.role,
						profilePicture: user.profilePicture,
						name: user.name,
						email: user.email,
						picture: user.profilePicture,
						isEmailVerified: user.isEmailVerified
					}
					console.log("NEW USER FROM authorize", newUser)

					return newUser
				}
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
		async jwt({ token, account, user }) {
			if (account && account.type === "credentials") {
				token.userId = account.providerAccountId
			}

			if (user) {
				token.role = user.role
				token.profilePicture = user.profilePicture || ""
				token.isEmailVerified = user.isEmailVerified
			}

			return token
		},
		async session({ session, token }) {
			console.log("CURRENT SESSION", session)
			console.log("CURRENT TOKEN", token)
			const newSession = {
				...session,
				user: {
					...session.user,
					id: token.userId,
					role: token.role,
					profilePicture: token.profilePicture,
					isEmailVerified: token.isEmailVerified
				} as Session["user"]
			}
			console.log("NEW SESSION", newSession)
			return newSession
		}
	},
	secret: process.env.AUTH_SECRET
} satisfies NextAuthConfig
