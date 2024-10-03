import z from "zod";


export const LoginSchema = z.object({
email: z.string().email({message:"email is required"}),
password: z.string().min(1,{message: "password is required"})
});




export type TLogin = z.infer<typeof LoginSchema>;
