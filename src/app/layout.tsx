import type { Metadata } from "next";
import "./globals.css";
import AuthWrapper from "@/components/AuthWrapper";
import ClientProvider from "@/components/ClientProvider";

export const metadata: Metadata = {
  title: "My Todo App",
  description: "An app built with Next.js and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>
          <AuthWrapper>{children}</AuthWrapper>
        </ClientProvider>
      </body>
    </html>
  );
}
