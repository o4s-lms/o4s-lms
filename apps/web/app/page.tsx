"use client"

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "next-auth/react"
import { Loading } from "@/components/loading"
import { redirect } from "next/navigation"

export default function Index() {
	const session = useSession()

	if (session.status === "loading") {
		<Loading />
	}

	if (!session) { 
		redirect("/signin")
	} else {
		redirect("/courses")
	}

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <p>HOME PAGE</p>
    </section>
  )
}
