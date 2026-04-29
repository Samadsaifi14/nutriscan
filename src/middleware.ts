import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const PROTECTED = ['/scan', '/dashboard', '/results', '/history', '/profile', '/log']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Check if this path needs protection
  const isProtected = PROTECTED.some(path => pathname.startsWith(path))
  if (!isProtected) return NextResponse.next()

  // Get the session token directly — works on Vercel unlike withAuth
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    // Not logged in — redirect to signin, remembering where they wanted to go
    const signInUrl = new URL('/auth/signin', req.url)
    signInUrl.searchParams.set('callbackUrl', req.url)
    return NextResponse.redirect(signInUrl)
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
    '/log/:path*',
  ],
}