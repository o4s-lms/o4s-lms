import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getSession } from "next-auth/react"
import { Loading } from "@/components/loading"
import { redirect } from "next/navigation"

export default async function IndexPage() {
	const session = await getSession()

	if (!session) redirect("/signin")

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <p>HOME PAGE</p>
    </section>
  )
}
