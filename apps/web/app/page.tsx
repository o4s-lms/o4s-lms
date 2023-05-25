"use client";

import Link from "next/link"
import { useQuery } from "@/lib/wundergraph"
import { type CoursesAuthorResponseData } from "@o4s/generated-wundergraph/models"

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"

import { useToast } from "@/hooks/use-toast"

type Course = CoursesAuthorResponseData["courses"][number];

export default function IndexPage() {
	const { toast } = useToast()
	
	const { data, error, isLoading } = useQuery({
		operationName: 'courses/author',
		enabled: true,
	})

	if (error) {
		return <p>{error.message}</p>;
	}
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Beautifully designed components <br className="hidden sm:inline" />
          built with Radix UI and Tailwind CSS.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          Accessible and customizable components that you can copy and paste
          into your apps. Free. Open Source. And Next.js 13 Ready.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href={siteConfig.links.docs}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ size: "lg" })}
        >
          Documentation
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          GitHub
        </Link>
				<Button
					onClick={() => {
						toast({
							title: "Scheduled: Catch up",
							description: "Friday, February 10, 2023 at 5:57 PM",
						})
					}}
				>
					Show Toast
				</Button>
      </div>

			<div className="flex gap-4">
				{!isLoading ? (
        	<p>{JSON.stringify(data?.courses)}</p>
				) : (
					<p>Is loading....</p>
				)}
      </div>
    </section>
  )
}
