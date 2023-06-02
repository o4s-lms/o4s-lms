"use client"

import Footer from "./components/footer"
import Navbar from "./components/nav-bar"

interface SiteLayoutProps {
  children: React.ReactNode
}

export default function SiteLayout({ children }: SiteLayoutProps) {
	return (
		<>
		<Navbar />
			<main className="dark:bg-gray-900">
				{children}
			</main>
		<Footer /></>
	)
}