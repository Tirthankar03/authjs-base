

// export const config = {
//         /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico, sitemap.xml, robots.txt (metadata files)
//      */

//     matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
//   }


import { auth } from "@/auth";
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}


export function middleware(req: NextRequest) {
  const cookies = req.cookies
  const { nextUrl } = req
  let isLoggedIn
  if (process.env.NODE_ENV === 'development') {
    isLoggedIn = !!cookies.get('authjs.session-token')
  } else if (process.env.NODE_ENV === 'production') {
    isLoggedIn = !!cookies.get('__Secure-authjs.session-token')
  }

    // Public routes that don't require authentication
  const publicRoutes = ['/auth/signin', '/auth/register', '/auth/error', '/auth/verify'];
  
  // Protected routes that require authentication
  const protectedRoutes = ['/page1', '/page2', '/'];

  // Allow access to public routes even without a token
  if (!isLoggedIn && publicRoutes.some(route => nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Redirect to dashboard if authenticated user tries to access public routes
  if (isLoggedIn && publicRoutes.some(route => nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Redirect to signin if unauthenticated user tries to access protected routes
  if (!isLoggedIn && protectedRoutes.some(route => nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  return NextResponse.next();

}