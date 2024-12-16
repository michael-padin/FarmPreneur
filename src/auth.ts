import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { DefaultSession, Session } from "next-auth"
import { Adapter } from "next-auth/adapters"

import { ROLE } from "@prisma/client"
import { DefaultJWT } from "next-auth/jwt"
import authConfig from "./auth.config"
import { db } from "./lib/db"

declare module "next-auth" {
	/**
	 * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: {
			id: string
			customerId?: string
			farmerId?: string
			role: ROLE
			profilePicture: string | null
			cartId?: string
			farmerName?: string
			isEmailVerified: boolean
			emailVerified: Date | null
		} & DefaultSession["user"]

		/** The user's postal address. */
		/**
		 * By default, TypeScript merges new interface properties and overwrites existing ones.
		 * In this case, the default session user properties will be overwritten,
		 * with the new ones defined above. To keep the default session user properties,
		 * you need to add them back into the newly declared interface.
		 */
	}

	interface User {
		role: ROLE
		cartId?: string
		profilePicture: string | null
		isEmailVerified: boolean
		emailVerified: Date | null
		createdAt: Date
	}
}
declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		user: Session["user"]
	}
}

export const { auth, handlers, signIn, signOut, unstable_update } = NextAuth({
	adapter: PrismaAdapter(db) as Adapter,
	session: { strategy: "jwt" },
	...authConfig
})
