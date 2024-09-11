import { register } from "@/action/user";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { getSession } from "@/lib/getSession";
import { redirect } from "next/navigation";
import FormRegister from "@/components/shared/FormRegister";

const Register = async () => {
  // const session = await getSession();
  // const user = session?.user;
  // if (user) redirect("/");

  return (
    <div className="mt-10 max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white border border-[#121212]  dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to MyShop
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Please provide all the necessary information
      </p>
      <FormRegister/>

    </div>
  );
};
export default Register;
