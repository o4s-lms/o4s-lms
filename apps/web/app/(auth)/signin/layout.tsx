import { Metadata } from "next"

import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: 'Sign In'
}

interface SignInLayoutProps {
  children: React.ReactNode
}

export default function SignInLayout({ children }: SignInLayoutProps) {
  return (
    <>
			{children}
    </>
  )
}