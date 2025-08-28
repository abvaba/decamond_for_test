import {AuthProvider} from "@/contexts";
import type {Metadata} from "next";
import "./globals.css";
import React from "react";
import {vazirFont} from './fonts';

export const metadata: Metadata = {
  title: "dashboard",
  description: "decamond test dashboard",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
    >
    <body
      className={`${vazirFont.className} antialiased`}
    >
    <AuthProvider>
      {children}
    </AuthProvider>
    </body>
    </html>
  );
}
