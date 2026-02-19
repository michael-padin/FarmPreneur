import NextAuth from "next-auth"
import { NextResponse, type NextRequest } from "next/server"
import authConfig from "./auth.config"
import {
	checkRateLimit,
	getClientIdentifier,
	setRateLimitHeaders
} from "./lib/rate-limit"
import {
	apiAuthPrefix,
	authRoutes,
	DEFAULT_LOGIN_REDIRECT,
	protectedRoutes
} from "./routes"

const { auth } = NextAuth(authConfig)

const toNumber = (value: string | undefined, fallback: number) => {
	const parsed = Number(value)
	return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

type RateLimitPolicy = {
	namespace: string
	limit: number
	windowMs: number
}

const RATE_LIMIT_POLICIES = {
	globalRead: {
		namespace: "global-read",
		limit: toNumber(process.env.RATE_LIMIT_GLOBAL_READ_LIMIT, 240),
		windowMs: toNumber(process.env.RATE_LIMIT_GLOBAL_READ_WINDOW_MS, 60_000)
	},
	globalWrite: {
		namespace: "global-write",
		limit: toNumber(process.env.RATE_LIMIT_GLOBAL_WRITE_LIMIT, 120),
		windowMs: toNumber(process.env.RATE_LIMIT_GLOBAL_WRITE_WINDOW_MS, 60_000)
	},
	serverAction: {
		namespace: "server-action",
		limit: toNumber(process.env.RATE_LIMIT_SERVER_ACTION_LIMIT, 50),
		windowMs: toNumber(process.env.RATE_LIMIT_SERVER_ACTION_WINDOW_MS, 60_000)
	},
	auth: {
		namespace: "auth-attempt",
		limit: toNumber(process.env.RATE_LIMIT_AUTH_LIMIT, 20),
		windowMs: toNumber(process.env.RATE_LIMIT_AUTH_WINDOW_MS, 10 * 60_000)
	},
	signup: {
		namespace: "signup-attempt",
		limit: toNumber(process.env.RATE_LIMIT_SIGNUP_LIMIT, 8),
		windowMs: toNumber(process.env.RATE_LIMIT_SIGNUP_WINDOW_MS, 15 * 60_000)
	},
	passwordReset: {
		namespace: "password-reset",
		limit: toNumber(process.env.RATE_LIMIT_PASSWORD_RESET_LIMIT, 6),
		windowMs: toNumber(
			process.env.RATE_LIMIT_PASSWORD_RESET_WINDOW_MS,
			15 * 60_000
		)
	},
	verifyEmail: {
		namespace: "verify-email",
		limit: toNumber(process.env.RATE_LIMIT_VERIFY_EMAIL_LIMIT, 20),
		windowMs: toNumber(
			process.env.RATE_LIMIT_VERIFY_EMAIL_WINDOW_MS,
			10 * 60_000
		)
	},
	upload: {
		namespace: "api-upload",
		limit: toNumber(process.env.RATE_LIMIT_UPLOAD_LIMIT, 40),
		windowMs: toNumber(process.env.RATE_LIMIT_UPLOAD_WINDOW_MS, 5 * 60_000)
	},
	deleteFile: {
		namespace: "api-delete-file",
		limit: toNumber(process.env.RATE_LIMIT_DELETE_FILE_LIMIT, 20),
		windowMs: toNumber(process.env.RATE_LIMIT_DELETE_FILE_WINDOW_MS, 5 * 60_000)
	},
	cron: {
		namespace: "api-cron",
		limit: toNumber(process.env.RATE_LIMIT_CRON_LIMIT, 5),
		windowMs: toNumber(process.env.RATE_LIMIT_CRON_WINDOW_MS, 60 * 60_000)
	}
} as const satisfies Record<string, RateLimitPolicy>

const STATIC_FILE_REGEX =
	/\.(?:avif|bmp|css|gif|ico|jpe?g|js|json|map|mp3|mp4|png|svg|txt|webmanifest|webp|woff2?)$/i

const getRateLimitPolicy = (req: NextRequest) => {
	const pathname = req.nextUrl.pathname
	const isServerActionRequest =
		req.method === "POST" && req.headers.has("next-action")

	if (pathname.startsWith(apiAuthPrefix) && req.method === "POST") {
		return RATE_LIMIT_POLICIES.auth
	}

	if (isServerActionRequest && pathname === "/login") {
		return RATE_LIMIT_POLICIES.auth
	}

	if (
		isServerActionRequest &&
		(pathname === "/signup" || pathname === "/register-farmer")
	) {
		return RATE_LIMIT_POLICIES.signup
	}

	if (isServerActionRequest && pathname === "/forgot-password") {
		return RATE_LIMIT_POLICIES.passwordReset
	}

	if (isServerActionRequest && pathname === "/verify-email") {
		return RATE_LIMIT_POLICIES.verifyEmail
	}

	if (pathname === "/api/upload") {
		return RATE_LIMIT_POLICIES.upload
	}

	if (pathname === "/api/delete-file") {
		return RATE_LIMIT_POLICIES.deleteFile
	}

	if (pathname === "/api/cron") {
		return RATE_LIMIT_POLICIES.cron
	}

	if (isServerActionRequest) {
		return RATE_LIMIT_POLICIES.serverAction
	}

	if (req.method === "GET" || req.method === "HEAD") {
		return RATE_LIMIT_POLICIES.globalRead
	}

	return RATE_LIMIT_POLICIES.globalWrite
}

const createRateLimitResponse = (
	req: NextRequest,
	retryAfterSeconds: number
) => {
	const isServerActionRequest =
		req.method === "POST" && req.headers.has("next-action")
	const isApiRequest = req.nextUrl.pathname.startsWith("/api")

	const response =
		isApiRequest || isServerActionRequest
			? NextResponse.json(
					{
						error: "Too many requests. Please try again shortly.",
						retryAfterSeconds
					},
					{ status: 429 }
				)
			: new NextResponse("Too many requests. Please try again shortly.", {
					status: 429
				})

	return response
}

export default auth(async function middleware(req) {
	const { nextUrl } = req
	const { pathname } = nextUrl

	if (pathname.startsWith("/_next") || STATIC_FILE_REGEX.test(pathname)) {
		return
	}

	const rateLimitPolicy = getRateLimitPolicy(req)
	const rateLimitResult = await checkRateLimit({
		...rateLimitPolicy,
		identifier: getClientIdentifier(req.headers)
	})

	console.log("rateLimitPolicy", rateLimitPolicy)

	if (!rateLimitResult.allowed) {
		const response = createRateLimitResponse(
			req,
			rateLimitResult.retryAfterSeconds
		)
		setRateLimitHeaders(response, rateLimitResult)
		return response
	}

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
		"/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
	]
}
