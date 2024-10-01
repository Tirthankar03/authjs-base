

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


// export function middleware(req: NextRequest) {
//   const cookies = req.cookies


//   console.log('middleware is running');


  
//   const { nextUrl } = req
//   let isLoggedIn
//   if (process.env.NODE_ENV === 'development') {
//     isLoggedIn = !!cookies.get('authjs.session-token')
//   } else if (process.env.NODE_ENV === 'production') {
//     isLoggedIn = !!cookies.get('__Secure-authjs.session-token')
//   }

//   //all routes are protected by default

//     // Public routes that don't require authentication
//   const publicRoutes = ['/auth/signin', '/auth/register', '/auth/error', '/auth/verify','/page1' , '/page2', '/'];
  
//   // Protected routes that require authentication
//   // const protectedRoutes = ['/page1', '/'];
//   // const protectedRoutes = ['/page1'];

//   // Allow access to public routes even without a token
//   if (!isLoggedIn && publicRoutes.some(route => nextUrl.pathname.startsWith(route))) {
//     return NextResponse.next();
//   }

//   // Redirect to dashboard if authenticated user tries to access public routes
//   // if (isLoggedIn && protectedRoutes.some(route => nextUrl.pathname.startsWith(route))) {
//   //   return NextResponse.redirect(new URL('/', req.url));
//   // }

//   // Redirect to signin if unauthenticated user tries to access protected routes
//   // if (!isLoggedIn && protectedRoutes.some(route => nextUrl.pathname.startsWith(route))) {
//   //   return NextResponse.redirect(new URL('/auth/signin', req.url));
//   // }

//   return NextResponse.next();

// }



export function middleware(req: NextRequest) {
  const cookies = req.cookies


  console.log('middleware is running');


  
  const { nextUrl } = req
  let isLoggedIn
  if (process.env.NODE_ENV === 'development') {
    isLoggedIn = !!cookies.get('authjs.session-token')
  } else if (process.env.NODE_ENV === 'production') {
    isLoggedIn = !!cookies.get('__Secure-authjs.session-token')
  }

  //all routes are protected by default

    // Public routes that don't require authentication
  const publicRoutes = ['/auth/signin', '/auth/register', '/auth/error', '/auth/verify','/page1' , '/page2', '/'];
  
  // Protected routes that require authentication
  // const protectedRoutes = ['/page1', '/'];
  // const protectedRoutes = ['/page1'];

  // Allow access to public routes even without a token
  if (!isLoggedIn && publicRoutes.some(route => nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Redirect to dashboard if authenticated user tries to access public routes
  // if (isLoggedIn && protectedRoutes.some(route => nextUrl.pathname.startsWith(route))) {
  //   return NextResponse.redirect(new URL('/', req.url));
  // }

  // Redirect to signin if unauthenticated user tries to access protected routes
  // if (!isLoggedIn && protectedRoutes.some(route => nextUrl.pathname.startsWith(route))) {
  //   return NextResponse.redirect(new URL('/auth/signin', req.url));
  // }

  return NextResponse.next();

}



// import NextAuth from "next-auth";
// import { NextResponse } from "next/server";

// import { authConfig } from "@/lib/auth.config";
// import { API_AUTH_PREFIX, AUTH_ROUTES, PROTECTED_ROUTES } from "@/routes";

// export const { auth } = NextAuth(authConfig);

// export default auth(req => {
//  const pathname = req.nextUrl.pathname;

//  // manage route protection
//  const isAuth = req.auth;

//  const isAccessingApiAuthRoute = pathname.startsWith(API_AUTH_PREFIX);
//  const isAccessingAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));
//  const isAccessingProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

//  if (isAccessingApiAuthRoute) {
//   return NextResponse.next();
//  }

//  if (isAccessingAuthRoute) {
//   if (isAuth) {
//    return NextResponse.redirect(new URL("/", req.url));
//   }

//   return NextResponse.next();
//  }

//  if (!isAuth && isAccessingProtectedRoute) {
//   return NextResponse.redirect(new URL("/login", req.url));
//  }
// });

// export const config = {
//  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };