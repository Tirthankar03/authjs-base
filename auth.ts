
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { User } from "./models/User";
import { compare } from "bcryptjs";
import client, { connectDB } from "./lib/db";
import google from 'next-auth/providers/google'
import Resend from "next-auth/providers/resend"
// import resend from 'next-auth/providers/resend'
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { html, text } from "./lib/auth-send-request";
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY!,
      from: 'onboarding@resend.dev',
      async sendVerificationRequest({ identifier: email, url, provider: { from } }) {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.AUTH_RESEND_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from,
            to: email,
            subject: `Sign in to Your App`,
            html: html({ url, host: 'http://localhost:3000' }),
            text: text({ url, host: 'http://localhost:3000' }),
          }),
        })

        if (!res.ok) throw new Error('Resend error: ' + JSON.stringify(await res.json()))
      },
    }),

    // Resend,
    // resend({
    //   server: {
    //     host: process.env.EMAIL_SERVER_HOST,
    //     port: process.env.EMAIL_SERVER_PORT,
    //     auth: {
    //       user: process.env.EMAIL_SERVER_USER,
    //       pass: process.env.EMAIL_SERVER_PASSWORD,
    //     },
    //   },
    //   from: process.env.EMAIL_FROM,
    // }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    google,

    // Google({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),

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
      verifyRequest:'/auth/verify',
    },
  //making the email verified if oauth is used 
    events: {
      async linkAccount({ user }) {
          await connectDB();
        const updateUser = await User.findById(user.id)

        updateUser.emailVerified = new Date()

        await updateUser.save()
      }
    },

  callbacks: {
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


    // signIn: async ({ user, account }) => {
    //   if (account?.provider === "google") {
    //     try {
    //       console.log('this is user in the google provider>>>>>>>>>>>>>>>>', user);
    //       console.log('this is account in the google provider>>>>>>>>>>>>>>>>', account);
          
    //       const { email, name, image, id } = user;
    //       await connectDB();
    //       const existingUser = await User.findOne({ email });


    //       //if not existing user, create a new user
    //       if (!existingUser) {
    //         const newUser = await User.create({ email, name, image, authProviderId: id });
    //         console.log('new user created successfully>>>>>>', newUser);  
    //         return true;
    //       }

    //       return true;
          
    //     } catch (error) {
    //       console.error('error in creating user>>>>>>>', error);
          
    //       throw new Error("Error while creating user");
    //     }
    //   }

    //   if (account?.provider === "credentials") {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
  },
});
