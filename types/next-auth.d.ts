// types/next-auth.d.ts

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface User {
        id: string
        role: string
        isCreator: boolean
        creator: string //probably a Creator schema, add later
        firstName: string
    
    }
    interface Session {
        user: User
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: string
        isCreator: boolean
        firstName: string
    }
}