"use client"

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "next-auth/react"
import { Loading } from "@/components/loading"
import { redirect } from "next/navigation"
import Hero from "./components/hero"
import Features from "./components/features"
import Courses from "./components/courses"
import Testimonials from "./components/testimonials"
import Pricing from "./components/pricing"

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
    <>
      <Hero />
      <Features />
      <Courses />
      <Testimonials />
      <Pricing />
    </>
  )
}
