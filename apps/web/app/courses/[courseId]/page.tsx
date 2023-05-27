"use client"

import { useRouter } from "next/router"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useQuery } from "@/lib/wundergraph"

import { Loading } from "@/components/loading"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import useLastActivityMutation from "@/hooks/use-last-activity-mutation"
import { useEffect } from "react"

export default function Course() {
	const { toast } = useToast()
	const { query: { courseId } } = useRouter()
	const updateLastActivity = useLastActivityMutation()

	useEffect(() => {
		updateLastActivity.trigger({
			courseId: parseInt(courseId as string),
		}, { throwOnError: false }) // this will fire only on first render
	}, [courseId, updateLastActivity])
	
	const { data, error, isLoading } = useQuery({
		operationName: 'courses/id',
		input: {
			id: parseInt(courseId as string),
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
		<div className="container grid items-center space-y-6 p-10 pb-16 md:block">
			{!isLoading ? (
			<>
				<div className="space-y-0.5">
					<h2 className="text-2xl font-bold tracking-tight">{data?.course?.name}</h2>
					<p className="text-muted-foreground">
						{data?.course?.description}
					</p>
				</div>
				<Separator className="my-6" />
				<div className="pb-8 pt-6 md:py-10">
							
				</div>
			</>
			) : (
				<Loading />
			)}
		</div>
  )
}