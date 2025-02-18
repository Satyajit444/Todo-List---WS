"use client";

import { SessionProvider } from "next-auth/react";

export default function ClientProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SessionProvider>{children}</SessionProvider>;
}
