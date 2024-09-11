'use client'
import { login } from "@/action/user";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
// import { signIn } from "@/auth";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/getSession";
import { Toaster, toast } from 'sonner'

const Form = () => {
  const router = useRouter()
 
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      
      const formData = new FormData(event.currentTarget);
      
      try {
        const result = await login(formData);

        console.log('result in frontend>>>>>>', result);

        if (result.success) {
          toast.success(result.message)
          router.push('/')
        }else{
          toast.error(result.message)
        }

} catch (error) {
    console.log('error in frontend>>>>>>>>', error);
    
}
    }
       
     
  


  return (
    <form className="my-8" 
    onSubmit={handleSubmit}
    >
         <Label htmlFor="email">Email Address</Label>
         <Input
           id="email"
           placeholder="projectmayhem@fc.com"
           type="email"
           name="email"
         />
 
         <Label htmlFor="email">Password</Label>
         <Input
           id="password"
           placeholder="*************"
           type="password"
           name="password"
           className="mb-6"
         />
 
         <button className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
           Login &rarr;
         </button>
 
         <p className="text-right text-neutral-600 text-sm max-w-sm mt-4 dark:text-neutral-300">
           Don't have account? <Link href="/auth/register">Register</Link>
         </p>
 
         <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
       </form>
  )
}

export default Form