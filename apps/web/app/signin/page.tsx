"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Command } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "./components/user-auth-form"

/**export const metadata: Metadata = {
  title: "SignIn",
  description: "Authentication forms built using the components.",
}*/

type Variant = 'LOGIN' | 'REGISTER';

export default function SignIn() {
	const router = useRouter();
	const emailParam = useSearchParams();
	const [variant, setVariant] = React.useState<Variant>('LOGIN');
	const [email, setEmail] = React.useState<string>(emailParam.get('email') || '');

	const toggleVariant = React.useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER');
    } else {
      setVariant('LOGIN');
    }
  }, [variant]);

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/authentication-light.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
        <Image
          src="/examples/authentication-dark.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div>
      <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        
        <div className="bg-muted relative hidden h-full flex-col p-10 text-white dark:border-r lg:flex">
          <div
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage:
                "url(http://joseantcordeiro.hopto.org:9000/images/web/auth_1.jpg)",
            }}
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Command className="mr-2 h-6 w-6" /> Open 4 Sustainability
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before. Highly recommended!&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
								{variant === 'LOGIN' ? 'Sign in to your account' : 'Create an account'}
              </h1>
              <p className="text-muted-foreground text-sm">
                Enter your email below to {variant === 'LOGIN' ? 'sign in to ' : 'create '} your account
              </p>
            </div>
            <UserAuthForm variant={variant} email={email} toogleVariant={() => toggleVariant()} />
            <p className="text-muted-foreground px-8 text-center text-sm">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="hover:text-primary underline underline-offset-4"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
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