/**
 *  An array of routes that are accessible to the public
 * These roues do not require authentication
 * @type {string[]}
 */

export const publicRoutes: string[] = ["/"]

/**
 *  An array of routes that are use for authentication
 * These routes will redirect login in users to the /overview**
 * @type {string[]}
 */
export const authRoutes: string[] = ["/login", "/signup"]

/**
 *
 *  The prefix for API authentication routes
 *  Routes that start with this prefix are used for use for API
 *  purposes
 * @type {string[]}
 */
export const apiAuthPrefix: string = "/api/auth"

/**
 *  The default redirect path after loging in
 * @type {string[]}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/dashboard/overview"
