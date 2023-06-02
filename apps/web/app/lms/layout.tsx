import { Metadata } from "next"
import Image from "next/image"

import SiteHeader from "@/components/site-header"
import { useHanko } from "@/hooks/use-hanko"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "LMS",
  description: "Open Source Learning Managment System.",
}

interface LmsLayoutProps {
  children: React.ReactNode
}

export default async function LmsLayout({ children }: LmsLayoutProps) {
	const hanko = useHanko()

	const currentUser = await hanko?.user.getCurrent()

	if (!currentUser) {
		redirect("/signin")
	}
	
  return (
		<div className="relative flex min-h-screen flex-col">
			<SiteHeader />
			<div className="flex-1">{children}</div>
		</div>
  )
}