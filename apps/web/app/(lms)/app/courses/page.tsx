"use client"

import Link from "next/link"
import { useQuery, withWunderGraph } from "@/lib/wundergraph"

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import { Loading } from "@/components/loading"

import { useToast } from "@/hooks/use-toast"
import { CourseCard } from "@/app/(lms)/app/courses/components/course-card"
import { Item } from "@radix-ui/react-dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

function Courses() {
	const { toast } = useToast()
	
	const { data, error, isLoading } = useQuery({
		operationName: 'courses/all',
		//input: {
		//	role: 'STUDENT',
		//},
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
		<div className="container grid items-center space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Courses</h2>
          <p className="text-muted-foreground">
            Manage your courses.
          </p>
        </div>
        <Separator className="my-6" />
				<div className="pb-8 pt-6 md:py-10">
					{!isLoading ? (
						<>
						{data?.courses?.length > 0 ? (
							<div className="hidden items-start justify-center gap-6 rounded-lg p-8 md:grid lg:grid-cols-2 xl:grid-cols-3">
								{data?.courses.map(item => (
									<CourseCard item={item} />
								))}
							</div>
						) : (
							<Alert className="bg-red-400 font-semibold">
								<AlertTitle>You do not have any course. 🪄</AlertTitle>
								<AlertDescription>
									<Button variant="link">
										<Link href="/products">Check your available courses.</Link>
									</Button>
								</AlertDescription>
							</Alert>
						)}
						</>
					) : (
						<Loading />
					)}
				</div>
		</div>
		</>
  )
}

export default withWunderGraph(Courses)
