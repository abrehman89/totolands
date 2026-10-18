import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const role = req.nextauth.token?.role

    // Admin routes — ADMIN role only
    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/auth/login?error=AdminOnly', req.url))
    }

    // Account/orders — any logged-in user
    if ((pathname.startsWith('/account') || pathname.startsWith('/orders')) && !role) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      // Only run middleware when a JWT token exists (logged-in users)
      // For /admin, unauthenticated users hit the authorized check and get redirected
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith('/admin')) return !!token
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/orders/:path*'],
}
