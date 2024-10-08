// 'use client'

// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { auth } from "@/auth";
// import { handleSignOut } from "@/action/authActions";
// import { useSessionData } from "next-auth/react";

// export default async function Navbar() {
//   //server
//   // const session = await auth();

//   //client
//   // const { data: session } = useSessionData();

//   // console.log({session});
//   return (
//     <nav className="flex justify-between items-center py-3 px-4 bg-white shadow-md">
//       <Link href="/" className="text-xl font-bold">
//         Auth.js
//       </Link>
//       {/* {!session ? (
//         <Link href="/auth/signin">
//           <Button variant="default">Sign In</Button>
//         </Link>
//       ) : (
//         <form action={handleSignOut}>
//           <Button variant="default" type="submit">
//             Sign Out
//           </Button>
//         </form>
//       )} */}
//     </nav>
//   );
// }
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { handleSignOut } from "@/action/authActions";
import { useSessionDataData } from "@/lib/useSessionData";
export default function Navbar() {
  //   //server
//   // const session = await auth();

//client
  const { data: session } = useSessionDataData();

  return (
    <nav className="flex justify-between items-center py-3 px-4 bg-white shadow-md">
      <Link href="/" className="text-xl font-bold">
        Auth.js
      </Link>
      {!session ? (
        <Link href="/auth/signin">
          <Button variant="default">Sign In</Button>
        </Link>
      ) : (
        <form action={handleSignOut}>
          <Button variant="default" type="submit">
            Sign Out
          </Button>
        </form>
      )}
    </nav>
  );
}
