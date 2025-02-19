import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-storage')?.value
  const isLoggedIn = authToken ? JSON.parse(decodeURIComponent(authToken)).state?.isLoggedIn : false
  
  // Paths that require authentication
  const protectedPaths = ['/post']
  // Paths that should redirect if already authenticated
  const authPaths = ['/login']
  
  const path = request.nextUrl.pathname
  
  // Redirect authenticated users away from auth pages
  if (isLoggedIn && authPaths.includes(path)) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // Redirect unauthenticated users away from protected pages
  if (!isLoggedIn && protectedPaths.some(p => path.startsWith(p))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/post/:path*']
} 