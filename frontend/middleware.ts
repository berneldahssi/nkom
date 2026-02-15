import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that don't require authentication
const publicRoutes = ['/', '/auth', '/pricing', '/onboarding']

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check if trying to access protected route
  if (pathname.startsWith('/dashboard')) {
    const accessToken = request.cookies.get('access_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '')

    // If no token, redirect to auth
    if (!accessToken) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all routes except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
