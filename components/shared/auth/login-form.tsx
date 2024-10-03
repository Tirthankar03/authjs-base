'use client'


import { LoginSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {   FormError} from "../form-error";
import {  FormSuccess } from "../form-success";
import { login } from "@/action/login";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";

export const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
? "Email already in use with different provider!": ""

const [error, setError] = useState<string | undefined>("");


  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
//won't do it in the server, would send it straight through client using react-query useMutation
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(async () => {
     const data = await login(values);

     if(data){
      setError(data.error)
     }
    })
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        className="space-y-6"
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                  disabled={isPending} 
                    {...field}
                    placeholder="john.doe@example.com"
                    type="email"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder="*****" type="password" />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
        </div>
        <FormError message={error || urlError}/>
        <FormSuccess message=""/>
        <Button disabled={isPending}  type="submit" className="w-full">
          Login
        </Button>
      </form>
    </Form>
  );
};
