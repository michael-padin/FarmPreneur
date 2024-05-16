import { NextResponse } from "next/server"
import NextAuth from "next-auth"

import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "@/routes"

import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req): Response | void | Promise<Response | void> => {
  const { nextUrl } = req

  const isLoggedIn = !!req.auth

  // route or path gamiton pag api auth
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)

  // route or path gamiton pag public dili need ih authenticate
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)

  // route gamiton pag login or register
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  // if api auth route, dili need ih redirect sa login or what
  if (isApiAuthRoute) {
    return
  }

  /**
   * if route or ang user ni navigate sa login or register and user is already logged in
   * ih redirect ni sa overview page
   */
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return
  }

  /**
   * if ang user dili wala naka login unya ang user ni adto
   * og protected route ih redirect ni sa login page
   */
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl))
  }

  return
})

// Supports both a single string value or an array of matchers
// @ref https://clerk.com/docs/references/nextjs/auth-middleware#usage
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
