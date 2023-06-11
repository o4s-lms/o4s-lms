import "@/styles/globals.css"
import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import SiteHeader from "@/components/site-header"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface LmsLayoutProps {
  children: React.ReactNode
}

export default function LmsLayout({ children }: LmsLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className="bg-background min-h-screen">
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<SiteHeader />
						{children}
						<Toaster />
						<TailwindIndicator />
					</ThemeProvider>
        </body>
      </html>
    </>
  )
}