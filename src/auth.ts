import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { DefaultSession } from "next-auth"
import { Adapter } from "next-auth/adapters"

import authConfig from "./auth.config"
import { db } from "./lib/db"

declare module "next-auth" {
	/**
	 * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: {
			role: "FARMER" | "BUYER" | "ADMIN"
			password: string | null
			createdAt: string
			isApproved: boolean
			isVerified: boolean
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
		isVerified: boolean
	}
}

export const { auth, handlers, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(db) as Adapter,
	session: { strategy: "database" },
	...authConfig
})
