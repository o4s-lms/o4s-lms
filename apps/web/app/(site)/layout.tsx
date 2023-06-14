import "@/styles/site.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Metadata } from "next"
import { siteConfig } from "@/config/site"
import Footer from "./components/footer"
import Navbar from "./components/nav-bar"

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

interface SiteLayoutProps {
  children: React.ReactNode
}

export default function SiteLayout({ children }: SiteLayoutProps) {
	return (
		<html lang="pt" suppressHydrationWarning>
    <head />
			<body className="dark:bg-gray-900">
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<Navbar />
						{children}
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	)
}