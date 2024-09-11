
import { signIn } from '@/auth'
import { FcGoogle } from 'react-icons/fc'
import { Button } from '@/components/ui/button'

export function SignInGoogle() {
  return (
    <form
      className="w-full"
      action={async () => {
        'use server'
        await signIn('google')
      }}
    >
      <Button className="md:h-[60px] h-[50px] w-full bg-inherit" variant="outline" type="submit">
        {' '}
        <FcGoogle />
      </Button>
    </form>
  )
}
