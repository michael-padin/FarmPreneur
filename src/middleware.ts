import { NextResponse } from "next/server"

import {
	apiAuthPrefix,
	authRoutes,
	DEFAULT_LOGIN_REDIRECT,
	protectedRoutes
} from "@/routes"
import { auth } from "./auth"

export default auth((req): Response | void | Promise<Response | void> => {
	const { nextUrl } = req
	const { pathname } = nextUrl

	const isLoggedIn = !!req.auth

	// route or path gamiton pag api auth
	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)

	// if api auth route, dili need ih redirect sa login
	if (isApiAuthRoute) {
		return
	}

	const isProtectedRoute = protectedRoutes.some((route) =>
		pathname.startsWith(route)
	)

	// route gamiton pag login or register
	const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

	/**
	 * if route or ang user ni navigate sa login o	r register and user is already logged in
	 * ih redirect ni sa overview page
	 */
	if (isAuthRoute) {
		if (isLoggedIn) {
			if (req.auth) {
				return NextResponse.redirect(
					new URL(DEFAULT_LOGIN_REDIRECT(req.auth?.user.role), nextUrl)
				)
			}
		}
		return
	}

	/**
	 * if ang user  wala naka login unya ang user ni adto
	 * og protected route ih redirect ni sa login page
	 */
	if (!isLoggedIn && isProtectedRoute) {
		return Response.redirect(new URL("/login", nextUrl))
	}

	return
})

// Supports both a single string value or an array of matchers
// @ref https://clerk.com/docs/references/nextjs/auth-middleware#usage
export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"]
}
