import { compare } from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import { type Provider } from "next-auth/providers"
import Google from "next-auth/providers/google"

import { getUserByEmail } from "./services/user"
import { LoginSchema } from "./types"

const providers: Provider[] = [
	Google({
		clientId: process.env.AUTH_GOOGLE_ID,
		clientSecret: process.env.AUTH_GOOGLE_SECRET,
		authorization: {
			params: {
				prompt: "consent",
				access_type: "offline",
				response_type: "code"
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
	callbacks: {
		jwt({ token, user }) {
			if (user) {
				token.role = user.role
			}
			return token
		},
		session({ session, token }) {
			session.user.role = token.role as string
			return session
		}
	},
	secret: "sdfsdfsdf"
} satisfies NextAuthConfig
