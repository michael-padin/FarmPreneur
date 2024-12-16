import { compare } from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import { type Provider } from "next-auth/providers"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

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

			if (passwordMatch) {
				const newUser = {
					id: user.id,
					role: user.role,
					profilePicture: user.profilePicture,
					name: user.name,
					email: user.email,
					picture: user.profilePicture,
					isEmailVerified: user.isEmailVerified,
					emailVerified: user.emailVerified,
					createdAt: user.createdAt,
					...(user.role === "CUSTOMER" && {
						customerId: user.customer?.id || "",
						cartId: user.customer?.cart?.id || ""
					}),
					...(user.role === "FARMER" && {
						farmerId: user.farmer?.id || "",
						farmerName: user.farmer?.farmName || ""
					})
				}

				return newUser
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
		async jwt({ token, user, trigger, session }) {
			if (user) {
				token.user = { ...user, id: user.id || "" }
			}
			if (trigger === "update" && session) {
				token = { ...token, user: session }
			}

			return token
		},
		async session({ session, token }) {
			session = {
				...session,
				user: {
					...session.user,
					...token.user,
					id: token.user.id || "",
					email: token.user.email || "",
					emailVerified: token.user.emailVerified,
					isEmailVerified: token.user.isEmailVerified,
					profilePicture: token.user.profilePicture,
					role: token.user.role,
					image: token.user.image,
					name: token.user.name,
					createdAt: token.user.createdAt
				}
			}

			return session
		}
	},
	secret: process.env.AUTH_SECRET
} satisfies NextAuthConfig
