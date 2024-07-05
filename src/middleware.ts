import { NextResponse } from "next/server"
import { auth } from "../auth"

/**
 * An array of routes that do not require auth
 * @type {string[]}
 */
export const publicRoutes = [
    '/',
]

/**
 * An array of used for auth
 * @type {string[]}
 */
export const authRoutes = [
    '/auth/login',
    '/auth/register',
]

/**
 * The prefix for API auth routes
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth'

/**
 * The default redirect path post login
 */
export const DEFAULT_LOGIN_REDIRECT = '/blog'

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname) || nextUrl.pathname.startsWith('/api/uploadthing')
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    if (isApiAuthRoute) return NextResponse.next()

    if (isAuthRoute) {
        if (isLoggedIn) return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))

        return NextResponse.next()
    }

    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL('/auth/login', nextUrl))
    }
})

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}