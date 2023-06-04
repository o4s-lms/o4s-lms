"use client"

import * as React from "react"
import Link from "next/link"
import { Command } from "lucide-react"
import dynamic from "next/dynamic"
import Brand from "@/components/brand"

/**export const metadata: Metadata = {
  title: "SignIn",
  description: "Authentication forms built using the components.",
}*/

const HankoAuth = dynamic(
	() => import('@/components/auth/hanko-auth'),
	{ ssr: false },
)

export default function SignIn() {
	const [error, setError] = React.useState<Error | null>(null)

  return (
    <>
      <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none">
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <Brand />
              <p className="text-muted-foreground text-sm">
                {/**Enter your email below to {variant === 'LOGIN' ? 'sign in to ' : 'create '} your account*/}
								Enter your email below to sign in or create your account
              </p>
            </div>
						<HankoAuth setError={setError} />
            <p className="text-muted-foreground px-8 text-center text-sm">
              By clicking continue, you agree to our{" "}
              <Link
                href="/legal/termos" target="_blank"
                className="hover:text-primary underline underline-offset-4"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/legal/privacidade" target="_blank"
                className="hover:text-primary underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  )
}