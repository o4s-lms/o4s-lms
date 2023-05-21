"use client";

import "./globals.css";
import React from "react";
import ToastProvider from "@/app/providers/Toast"
//import AuthProvider from "@/app/providers/Auth"

import cx from "classnames";
import { sfPro, inter } from "./fonts";
import { SessionProvider } from "next-auth/react";

export const dynamic = 'auto';
export const dynamicParams = true;
export const revalidate = false;
export const fetchCache = 'auto';
export const runtime = 'nodejs';
export const preferredRegion = 'all';
/**
export const metadata = {
  title: "Precedent - Building blocks for your Next.js project",
  description:
    "Precedent is the all-in-one solution for your Next.js project. It includes a design system, authentication, analytics, and more.",
  twitter: {
    card: "summary_large_image",
    title: "Precedent - Building blocks for your Next.js project",
    description:
      "Precedent is the all-in-one solution for your Next.js project. It includes a design system, authentication, analytics, and more.",
    creator: "@steventey",
  },
  metadataBase: new URL("https://precedent.dev"),
  themeColor: "#FFF",
}; */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cx(sfPro.variable, inter.variable)}>
				<SessionProvider>
					<ToastProvider />
					<div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
					<main className="flex min-h-screen w-full flex-col items-center justify-center py-32">
						{children}
					</main>
				</SessionProvider>
      </body>
    </html>
  );
}
