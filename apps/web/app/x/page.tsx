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

type Courses = UsersMy_coursesResponseData["users"]

export default async function Dashboard() {
	const { toast } = useToast()
	
	/**const { data, error, isLoading } = useQuery({
		operationName: 'users/my-courses',
		enabled: true,
	})

	if (error) return <p>{error.message}</p>*/

	const isLoading = false
	
  return (
		<>
		<div className="container grid items-center space-y-6">
			<div className="gap-6 pb-8 pt-6 md:py-10">
				{!isLoading ? (
					<><div>DASHBOARD</div></>
				) : (
					<Loading />
				)}
      </div>
		</div>
		</>
  )
}
