'use client'
import { register } from "@/action/user";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { toast } from "sonner";

const FormRegister = () => {
  const router = useRouter()

   
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    try {
      const result = await register(formData);

      console.log('result in frontend>>>>>>', result);

      if (result.success) {
        toast.success(result.message)
        router.push('/auth/login')
      }else{
        toast.error(result.message)
      }

} catch (error) {
  console.log('error in frontend>>>>>>>>', error);
  
}
  }

  return (
    <form className="my-8" action={register}>
    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
      <div className="flex flex-col">
        <Label htmlFor="firstname" className="mb-2">
          First Name
        </Label>
        <Input
          id="firstname"
          placeholder="Tyler"
          type="text"
          name="firstname"
        />
      </div>
      <div className="flex flex-col">
        <Label htmlFor="lastname" className="mb-2">
          Last Name
        </Label>
        <Input
          id="lastname"
          placeholder="Durden"
          type="text"
          name="lastname"
        />
      </div>
    </div>

    <Label htmlFor="email">Email Address</Label>
    <Input
      id="email"
      placeholder="projectmayhem@fc.com"
      type="email"
      name="email"
    />

    <Label htmlFor="password">Password</Label>
    <Input
      id="password"
      placeholder="***********"
      type="password"
      name="password"
      className="mb-5"
    />

    <button className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
      Sign up &rarr;
    </button>

    <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
      Already have an account? <Link href="/auth/signin">Login</Link>
    </p>
  </form>
  )
}

export default FormRegister