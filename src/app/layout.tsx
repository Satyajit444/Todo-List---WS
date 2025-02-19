import type { Metadata } from "next";
import "./globals.css";
import AuthWrapper from "@/components/AuthWrapper";
import ClientProvider from "@/components/ClientProvider";
import ThemeProvider from "@/components/ThemeProvider"; 

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
      <body className="dark:bg-slate-800 dark:text-white">
        <ClientProvider>
          <ThemeProvider>
            <AuthWrapper>{children}</AuthWrapper>
          </ThemeProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
