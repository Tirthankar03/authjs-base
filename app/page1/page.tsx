"use client";

import { useSessionDataData } from "@/lib/useSessionData";


export default function Page1() {
  const { data: session, update } = useSessionDataData();

  console.log("page1 session>>>>>>>", session);
  
  return (
    <>
      <button
        onClick={() => {
          session?.user && update({ ...session.user, name: "asdasdasd singh" });
        }}
      >
        Update session
      </button>
      <h1>Can be accessed by any user.</h1>
    </>
  );
}
