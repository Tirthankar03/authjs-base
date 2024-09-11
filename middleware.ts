// // export { auth as middleware } from "@/auth";
// import { auth } from "@/auth";
// import { getToken } from 'next-auth/jwt';
// import { NextRequest, NextResponse } from 'next/server';

// // export const config = {
// //     matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
// // };


// export const config = {
//     matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
//   }


// export default auth((request) => {



//     // if (!req.auth && req.nextUrl.pathname !== "/login") {
//     //   const newUrl = new URL("/login", req.nextUrl.origin)
//     //   return Response.redirect(newUrl)
//     // }

//     const token = request.auth 

//     console.log('token in the middleware>>>>>>>>>>', request.auth);
    
//     const url = request.nextUrl;
  
//     // Redirect to dashboard if the user is already authenticated
//     // and trying to access sign-in, sign-up, or home page
//     if (
//       token &&
//       (url.pathname.startsWith('/auth/signin') ||
//         url.pathname.startsWith('/auth/register') 
//     )
//     ) {
//       return NextResponse.redirect(new URL('/', request.url));
//     }
  
//         if ( !token && (
//         url.pathname.startsWith('/page1') ||
//         url.pathname.startsWith('/page2') ||
//         url.pathname.startsWith('/') 
//     )
//     ) {
//       return NextResponse.redirect(new URL('/auth/signin', request.url));
//     }
//     // return NextResponse.next();
//   })


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

// export default auth((request) => {
//   const token = request.auth;
//   const url = request.nextUrl;

//   console.log('token in the middleware>>>>>>>>>>', token);

//   // Public routes that don't require authentication
//   const publicRoutes = ['/auth/signin', '/auth/register'];
  
//   // Protected routes that require authentication
//   const protectedRoutes = ['/page1', '/page2', '/'];

//   // Allow access to public routes even without a token
//   if (!token && publicRoutes.some(route => url.pathname.startsWith(route))) {
//     return NextResponse.next();
//   }

//   // Redirect to dashboard if authenticated user tries to access public routes
//   if (token && publicRoutes.some(route => url.pathname.startsWith(route))) {
//     return NextResponse.redirect(new URL('/', request.url));
//   }

//   // Redirect to signin if unauthenticated user tries to access protected routes
//   if (!token && protectedRoutes.some(route => url.pathname.startsWith(route))) {
//     return NextResponse.redirect(new URL('/auth/signin', request.url));
//   }

//   // Allow access to protected routes if authenticated
//   return NextResponse.next();
// })

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
  const publicRoutes = ['/auth/signin', '/auth/register'];
  
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