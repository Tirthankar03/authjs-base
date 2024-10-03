'use client';

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { useMemo } from "react";

type Props = {
    session: Session | null;
    sessionKey: number;
    children: React.ReactNode;
}

export function AuthProvider({ children, ...props }: Props) {
  const { session,sessionKey } = props;
  const memoizedSessionKey = useMemo(() => {
    console.log('session changed >>> ', session);

    return sessionKey;
  }, [session]);

  return (
    <SessionProvider key={memoizedSessionKey} session={session}>
      {children}
    </SessionProvider>
  );
}