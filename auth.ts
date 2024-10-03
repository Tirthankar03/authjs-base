import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { User } from "./models/User";
import { compare } from "bcryptjs";
import { connectDB } from "./lib/db";
import google from "next-auth/providers/google";
import { LoginSchema } from "./schemas";
import { credentialLogin } from "./action/login";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
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

      // credentials: {
      //   email: { label: "Email", type: "email" },
      //   password: { label: "Password", type: "password" },
      // },

      authorize: async (credentials) => {
        // const email = credentials.email as string | undefined;
        // const password = credentials.password as string | undefined;

        const validatedFields = LoginSchema.safeParse(credentials);

        console.log("this is credentials>>>>>>", credentials);

        console.log('validated fields?>>>>>>>', validatedFields.data);
        
        

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const { data, userCookie }  = await credentialLogin({email,password})

          console.log('data in authorize>>>>>>>>>', data);

          if(data.error) return null

          //manually setting the user cookie
          if (userCookie) {
            cookies().set('user', userCookie.split(';')[0].split('=')[1], {
              path: '/',
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
            });
          }



          return data.user //return null to throw error, return something to allow the user to login. The logic is yours

          // if (!email || !password) {
          //   throw new CredentialsSignin("Please provide both email & password");
          // }


        //   await connectDB();

        //   const user = await User.findOne({ email }).select("+password +role");

        //   if (!user) {
        //     throw new Error("Invalid email or password");
        //   }

        //   if (!user.password) {
        //     throw new Error("Invalid email or password");
        //   }

        //   /*
        //   in some apps they strictly deny a person who logs in using a provider to use credentials
        //   if (!user || !user.password) return null;
        // */

        //   const isMatched = await compare(password, user.password);

        //   if (!isMatched) {
        //     throw new Error("Password did not matched");
        //   }

        //   const userData = {
        //     firstName: user.firstName,
        //     lastName: user.lastName,
        //     email: user.email,
        //     role: user.role,
        //     id: user._id,
        //   };

        //   //can return the entire user as well
        //   return userData;

        
        }

        return null; // if the validation doesn't work
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  callbacks: {
    async session({ session, token }) {
      if (token?.sub && token?.role) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.isCreator = token.isCreator;
      }
      return session;
    },

    async jwt({ token, user }) {
      // v2
        // if(!token.sub) return token
        //const existing User = await getUserById(token.sub);
        // if (!existingUser) return token;
        // token.role = existingUser.role;
        //return token
        console.log('user in jwt>>>>>>>>>>>>>>',user);
        console.log('token in jwt>>>>>>>>>>>>>>',token);
        
      if (user) {
        // token.role = user.role;
        token.isCreator = !!user.creator;
        token.firstName = user.firstName //user remains undefined and no one knows why
      }
      return token;
    },

    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        /*
        payload: {email, name, image, id}
        will make an api call to a route that does the following:
          -checks for existing user
          -if not, create a new user => also add the authProviderId from payload
          -return response
        */

        try {
          console.log(
            "this is user in the google provider>>>>>>>>>>>>>>>>",
            user
          );
          console.log(
            "this is account in the google provider>>>>>>>>>>>>>>>>",
            account
          );

          const { email, name, image, id } = user;
          await connectDB();
          const existingUser = await User.findOne({ email });

          //if not existing user, create a new user
          if (!existingUser) {
            const newUser = await User.create({
              email,
              name,
              image,
              authProviderId: id,
            });
            console.log("new user created successfully>>>>>>", newUser);
            return true;
          }

          return true;
        } catch (error) {
          console.error("error in creating user>>>>>>>", error);

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
