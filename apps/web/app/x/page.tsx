"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { useQuery } from "@/lib/wundergraph"
import { type UsersMy_coursesResponseData } from "@o4s/generated-wundergraph/models"

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import { Loading } from "@/components/loading"

import { useToast } from "@/hooks/use-toast"
import { CourseCard } from "./components/course-card"
import { Item } from "@radix-ui/react-dropdown-menu"

type Courses = UsersMy_coursesResponseData["users"]

export default function Dashboard() {
	const { toast } = useToast()
	
	const { data, error, isLoading } = useQuery({
		operationName: 'members/courses',
		input: {
			role: 'STUDENT',
		},
		enabled: true,
	})

	if (error) {
		toast({
			variant: "destructive",
			title: "Uh oh! Something went wrong.",
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">{error.message}</code>
				</pre>
			),
		})
	}
	
  return (
		<>
		<div className="container grid items-center space-y-6">
			<div className="gap-6 pb-8 pt-6 md:py-10">
				{!isLoading ? (
					<>
					{data?.courses.map(item => (
						<CourseCard item={item} />
					))}
					</>
				) : (
					<Loading />
				)}
      </div>
		</div>
		</>
  )
}
