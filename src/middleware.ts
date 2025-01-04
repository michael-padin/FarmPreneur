import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import authConfig from "./auth.config"
import { authRoutes, DEFAULT_LOGIN_REDIRECT, protectedRoutes } from "./routes"

const { auth } = NextAuth(authConfig)
export default auth(async function middleware(req) {
	const { nextUrl } = req
	const { pathname } = nextUrl
	const isLoggedIn = !!req.auth
	const user = req.auth?.user

	// 2. Check for auth routes
	const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

	if (pathname === "/" && user?.role === "FARMER") {
		return NextResponse.redirect(
			new URL(DEFAULT_LOGIN_REDIRECT(user?.role || "CUSTOMER"), nextUrl)
		)
	} else if (
		pathname.startsWith("/dashboard/farmer") &&
		user?.role === "CUSTOMER"
	) {
		return NextResponse.redirect(
			new URL(DEFAULT_LOGIN_REDIRECT(user?.role || "CUSTOMER"), nextUrl)
		)
	}

	if (isAuthRoute) {
		if (isLoggedIn) {
			// Redirect to default page if already logged in
			return NextResponse.redirect(
				new URL(DEFAULT_LOGIN_REDIRECT(user?.role || "CUSTOMER"), nextUrl)
			)
		}
	}

	// 3. Check for protected routes
	const isProtectedRoute = protectedRoutes.some((route) =>
		pathname.startsWith(route)
	)

	if (isProtectedRoute) {
		if (!isLoggedIn) {
			// Redirect to login if not authenticated
			return NextResponse.redirect(new URL("/login", nextUrl))
		} else {
			// Redirect to verify-email page if not verified
			if (!user?.isEmailVerified) {
				return NextResponse.redirect(new URL("/verify-email", nextUrl))
			}
		}
	}

	return
})
// Supports both a single string value or an array of matchers
// @ref https://clerk.com/docs/references/nextjs/auth-middleware#usage
export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
	]
}
