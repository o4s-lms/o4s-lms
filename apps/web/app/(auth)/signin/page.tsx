"use client"

import * as React from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import Brand from "@/components/brand"
import { useSearchParams } from "next/navigation"

/**export const metadata: Metadata = {
  title: "SignIn",
  description: "Authentication forms built using the components.",
}*/

const HankoAuth = dynamic(
	() => import('./components/hanko-auth'),
	{ ssr: false },
)

export default function SignIn() {
	const [error, setError] = React.useState<Error | null>(null)
	const searchParams = useSearchParams()
  const callback = searchParams.get("callback") || '/app'

  return (
    <>
      <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none">
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <Brand />
            </div>
						<HankoAuth callback={callback} setError={setError} />
            <p className="text-muted-foreground px-8 text-center text-sm">
							Ao clicar em continuar, você concorda com nossos{" "}
              <Link
                href="/legal/termos" target="_blank"
                className="hover:text-primary underline underline-offset-4"
              >
                Termos e Condições
              </Link>{" "}
              e{" "}
              <Link
                href="/legal/privacidade" target="_blank"
                className="hover:text-primary underline underline-offset-4"
              >
                Política de Privacidade
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
