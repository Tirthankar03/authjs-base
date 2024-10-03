// types/next-auth.d.ts

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface User {
        id: string
        role: string
    }
    interface Session {
        user: User
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: string
    }
}

// Make the getCsrfToken accessible outside of next-auth package
declare module 'next-auth/react' {
	function getCsrfToken(): Promise<string>
}