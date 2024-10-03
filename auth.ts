
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { User } from "./models/User";
import { compare } from "bcryptjs";
import { connectDB } from "./lib/db";
import google from 'next-auth/providers/google'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    // google,

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    Credentials({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      authorize: async (credentials) => {
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        if (!email || !password) {
          throw new CredentialsSignin("Please provide both email & password");
        }

        await connectDB();

        const user = await User.findOne({ email }).select("+password +role");

        if (!user) {
          throw new Error("Invalid email or password");
        }

        if (!user.password) {
          throw new Error("Invalid email or password");
        }

        const isMatched = await compare(password, user.password);

        if (!isMatched) {
          throw new Error("Password did not matched");
        }

        const userData = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          id: user._id,
        };

        return userData;
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
      error: '/auth/error',
    },

  callbacks: {
    // authorized({ request: { nextUrl }, auth }) {
    //                 const isLoggedIn = !!auth?.user;
    //                 const { pathname } = nextUrl;
    //                 const role = auth?.user.role || 'user';
    //                 if (pathname.startsWith('/auth/signin') && isLoggedIn) {
    //                     return Response.redirect(new URL('/', nextUrl));
    //                 }
                    
    //                 if (pathname.startsWith("/page2") && role !== "admin") {
    //                     return Response.redirect(new URL('/', nextUrl));
    //                 }
    //                 return !!auth;
    //             },
    async session({ session, token }) {
      if (token?.sub && token?.role) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },

    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        try {
          console.log('this is user in the google provider>>>>>>>>>>>>>>>>', user);
          console.log('this is account in the google provider>>>>>>>>>>>>>>>>', account);
          
          const { email, name, image, id } = user;
          await connectDB();
          const existingUser = await User.findOne({ email });


          //if not existing user, create a new user
          if (!existingUser) {
            const newUser = await User.create({ email, name, image, authProviderId: id });
            console.log('new user created successfully>>>>>>', newUser);  
            return true;
          }

          return true;
          
        } catch (error) {
          console.error('error in creating user>>>>>>>', error);
          
          throw new Error("Error while creating user");
        }
      }

      if (account?.provider === "credentials") {
        return true;
      } else {
        return false;
      }
    },
  },
});
