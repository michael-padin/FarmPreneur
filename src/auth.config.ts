import { compare } from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import { type Provider } from "next-auth/providers"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import Resend from "next-auth/providers/resend"
import { encode as defaultEncode } from "next-auth/jwt"

import { getUserByEmail } from "./services/user"
import { LoginSchema } from "./types"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db"

const adapter = PrismaAdapter(db)

const providers: Provider[] = [
	Credentials({
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
		clientSecret: process.env.AUTH_GOOGLE_SECRET,
		profile(profile) {
			return {
				...profile,
				isVerified: true
			}
		}
	})
]

export default {
	providers,
	debug: process.env.NODE_ENV === "development",
	pages: {
		signIn: "/login"
	},
	jwt: {
		encode: async function (params) {
			if (params.token?.credentials) {
				const sessionToken = crypto.randomUUID()

				if (!params.token.sub) {
					throw new Error("No user ID found in token")
				}

				const createdSession = await adapter?.createSession?.({
					sessionToken: sessionToken,
					userId: params.token.sub,
					expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
				})

				if (!createdSession) {
					throw new Error("Failed to create session")
				}

				return sessionToken
			}
			return defaultEncode(params)
		}
	},
	callbacks: {
		async jwt({ token, user, account }) {
			if (account?.provider === "credentials") {
				token.credentials = true
			}
			return token
		},
		session({ session, user }) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { password, ...newUser } = session.user
			return {
				...session,
				user: {
					...newUser
				}
			}
		}
	},
	secret: process.env.AUTH_SECRET
} satisfies NextAuthConfig
