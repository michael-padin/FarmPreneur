import { compare } from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import { type Provider } from "next-auth/providers"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

import { LoginSchema } from "./app/(auth)/login/_types"
import { getUserByEmail } from "./services/user"

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
          profile,
          ...newUser
        } = user

        if (passwordMatch) return newUser
      }
      return null
    },
  }),
  // Google({
  //   clientId: process.env.AUTH_GOOGLE_ID,
  //   clientSecret: process.env.AUTH_GOOGLE_SECRET,
  //   authorization: {
  //     params: {
  //       prompt: "consent",
  //       access_type: "offline",
  //       response_type: "code",
  //     },
  //   },
  // }),
]

export default {
  providers,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.address = user.address
      }
      return token
    },
    session({ session, token }) {
      session.user.role = token.role as string
      session.user.address = token.address as string
      return session
    },
  },
  secret: "sdfsdfsdf",
} satisfies NextAuthConfig
