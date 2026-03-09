'use client'

import { Inter } from "next/font/google";
import "./globals.css";

import Background from "./components/Background";
import Nav from "./components/Nav";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <head>
            <meta name="theme-color" content="#3b82f6" media="(prefers-color-scheme: light)"></meta>
            <meta name="theme-color" content="#0d0d0d" media="(prefers-color-scheme: dark)"></meta>
        </head>
        <body className="flex w-screen h-screen sm:h-dvh sm:overflow-hidden bg-blue-500 dark:bg-[#0d0d0d]">
            <SessionProvider>
                <Nav />
                <div className='flex-1 relative flex flex-col sm:items-center'>
                    {/* <Background /> */}
                    {children}
                </div>
            </SessionProvider>
        </body>
    </html>
  );
}
