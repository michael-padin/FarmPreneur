import { NextResponse } from "next/server"
import { auth } from "@/auth"
import {
	apiAuthPrefix,
	authRoutes,
	DEFAULT_LOGIN_REDIRECT,
	protectedRoutes
} from "./routes"
import { getUserFarmerById } from "./data-access/users"
import { getFarmerDetailsByUserIdUseCase } from "./use-cases/farm-details"

export default auth(async (req) => {
	const { nextUrl } = req
	const { pathname } = nextUrl
	const isLoggedIn = !!req.auth
	const user = req.auth?.user

	// 1. API routes should be handled first and returned immediately
	if (pathname.startsWith(apiAuthPrefix)) {
		return
	}

	// 2. Check for auth routes
	const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))
	if (isAuthRoute) {
		if (isLoggedIn) {
			// Redirect to default page if already logged in
			return NextResponse.redirect(
				new URL(DEFAULT_LOGIN_REDIRECT(user?.role || "CUSTOMER"), nextUrl)
			)
		}
		// Allow access to auth routes if not logged in
		return
	}

	// 3. Check for protected routes
	const isProtectedRoute = protectedRoutes.some((route) =>
		pathname.startsWith(route)
	)
	if (isProtectedRoute) {
		if (!isLoggedIn) {
			// Redirect to login if not authenticated
			return NextResponse.redirect(new URL("/login", nextUrl))
		}
		if (user && !user.isVerified) {
			// Redirect to email verification if not verified
			return NextResponse.redirect(new URL("/verify-email", nextUrl))
		}

		// New check for farmer role and store information
		if (user && user.role === "FARMER") {
			const userStore = await getFarmerDetailsByUserIdUseCase(user.id!)
			if (!userStore) {
				// Redirect to store setup page if farmer doesn't have store information
				return NextResponse.redirect(
					new URL("/complete-farmer-information", nextUrl)
				)
			}
		}
	}

	// 4. For all other routes, allow access
	return
})
// Supports both a single string value or an array of matchers
// @ref https://clerk.com/docs/references/nextjs/auth-middleware#usage
export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"]
}
