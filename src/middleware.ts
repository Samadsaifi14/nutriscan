import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const AUTH_REQUIRED_PREFIXES = [
  '/scan',
  '/dashboard',
  '/results',
  '/history',
  '/profile',
  '/profile-setup',
  '/log',
  '/contribute',
  '/validate',
  '/correct-product',
  '/scan-history',
  '/admin',
  '/insights',
  '/search',
  '/favorites',
  '/settings',
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isProtected = AUTH_REQUIRED_PREFIXES.some((path) => pathname.startsWith(path))
  if (!isProtected) return NextResponse.next()

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    const signInUrl = new URL('/auth/signin', req.url)
    signInUrl.searchParams.set('callbackUrl', req.url)
    return NextResponse.redirect(signInUrl)
  }

  if (pathname.startsWith('/admin')) {
    const role = (token as any).role
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/scan/:path*',
    '/dashboard/:path*',
    '/results/:path*',
    '/history/:path*',
    '/profile/:path*',
    '/profile-setup/:path*',
    '/log/:path*',
    '/contribute/:path*',
    '/validate/:path*',
    '/correct-product/:path*',
    '/scan-history/:path*',
    '/admin/:path*',
    '/insights/:path*',
    '/search/:path*',
    '/favorites/:path*',
    '/settings/:path*',
  ],
}
