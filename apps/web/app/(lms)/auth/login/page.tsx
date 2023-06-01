"use client"

import dynamic from "next/dynamic"
import { Suspense, useState } from "react"

const HankoAuth = dynamic(
	// replace with path to your component using the <hanko-auth> element
	() => import('@/components/auth/hanko-auth'),
	{ ssr: false },
)

export default function Login() {
	const [error, setError] = useState<Error | null>(null);

  return (
    <Suspense fallback={"Loading ..."}>
      <HankoAuth setError={setError} />
    </Suspense>
  )
}