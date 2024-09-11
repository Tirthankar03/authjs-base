/**
 * Renders a sign-in resend form that allows users to request a new sign-in link.
 * The form includes an email input field and a submit button.
 * When the form is submitted, the `signIn` function is called with the 'resend' strategy to send a new sign-in link to the user's email.
 */

import { signIn } from '@/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'


export function SignInResend() {

  return (
    <form
      className="flex flex-col items-center gap-4"
      action={async (formData) => {
        'use server'
        await signIn('resend', formData)
      }}
    >
      <Input
        className="h-[50px] w-full p-4 md:h-[60px]"
        type="email"
        name="email"
        placeholder="john@doe.com"
      />
      <Button className="h-[50px] w-full md:h-[60px]" type="submit">
        Login
      </Button>
    </form>
  )
}
