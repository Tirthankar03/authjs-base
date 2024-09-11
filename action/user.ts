"use server";

import {connectDB} from "@/lib/db";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { CredentialsSignin } from "next-auth";
import { signIn } from "@/auth";

const login = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const result = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      email,
      password,
    });

    console.log("result>>>>>>>", result);

  return {message: 'user logged in successfully', success: true}
  // redirect("/");


  } catch (error) {
    const someError = error as CredentialsSignin;
    const errorMessage = someError.cause?.err?.message || "Unknown error occurred";
    console.log('errorMessage>>>>>>>>', errorMessage);
    console.log('someError.cause>>>>>>>>', someError.cause);
    console.log('someError>>>>>>>>', someError);
    
  
    return {message: errorMessage, success: false};

    // return {error: "Issue with signIn. Please try again"}; // Return a generic error message
    
  }
};

const register = async (formData: FormData) => {
  try {
    const firstName = formData.get("firstname") as string;
    const lastName = formData.get("lastname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
  
    if (!firstName || !lastName || !email || !password) {
      // throw new Error("Please fill all fields");
      return {message: "Please fill all fields", success: false};
    }
  
    await connectDB();
  
    // existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("User already exists");
  
    const hashedPassword = await hash(password, 12);
  
    const newUser = await User.create({ firstName, lastName, email, password: hashedPassword });
    console.log(`User created successfully 🥂`);
    return {message: "User created successfully", success: true, user: newUser};
    // redirect("/login");
  } catch (error) {
    return {message: "Something went wrong. Please try again", success: false};
  }

};

const fetchAllUsers = async () => {
  await connectDB();
  const users = await User.find({});
  return users;
};

export { register, login, fetchAllUsers };
