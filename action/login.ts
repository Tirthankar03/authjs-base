"use server";
import axios, { AxiosError } from 'axios'
import z from "zod";
import { LoginSchema, TLogin } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { cookies} from 'next/headers'
export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  console.log(validatedFields);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error; //to get redirected, mentioned in official authjs docs
  }
};




export async function credentialLogin(input:TLogin) {
  try {
    console.log('input in credentialLogin>>>>>>>>>', input);
    
    const response = await axios.post(`${process.env.BASE_API_URL}/api/v1/user-auth/login`,{email:input.email, password: input.password});
    const data = response.data;
    console.log("data in credentialLogin>>>>>>>>>>", data);

    console.log("cookies in credentialLogin>>>>>>>>>>", response.headers['set-cookie']);

    const userCookie = response.headers['set-cookie']?.find((cookie: string) => cookie.startsWith('user='));

    
    return {data, userCookie};

  } catch (error:any) {
    console.error("error in credentialLogin>>>>>>>>:", error.response.data);
    return error.response.data
    
  }
}





