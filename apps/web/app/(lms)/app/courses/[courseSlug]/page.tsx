"use client"

import * as React from "react"
import Link from "next/link"
import { useQuery, withWunderGraph } from "@/lib/wundergraph"

import { Loading } from "@/components/loading"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import useLastActivityMutation from "@/hooks/use-last-activity-mutation"
import { useEffectOnce } from "usehooks-ts"
import { SidebarNav } from "../components/sidebar-nav"
import { columns } from "../components/tasks/columns"
import { DataTable } from "../components/tasks/data-table"
import { taskSchema } from "../components/tasks/data/schema"
import { getTasks } from "@/actions/tasks"
import { TasksAllResponseData } from "@o4s/generated-wundergraph/models"

type Tasks = TasksAllResponseData["tasks"]

function Course({ params }: { params: { courseSlug: string } }) {
	const { toast } = useToast()
	const updateLastActivity = useLastActivityMutation()
  const [tasks, setTasks] = React.useState<Tasks>([])

	/**useEffectOnce(() => {
    updateLastActivity.trigger({
			course_id: params.courseId
		}, { throwOnError: false }) // this will fire only on first render
  })*/
  React.useEffect(() => {
    async function tasks() {
			const t: Tasks = await getTasks()
			if (!ignore) {
        setTasks(t)
      }
		}
		let ignore = false
		tasks()
		return () => {
      ignore = true
    }
  }, [])

	const { data, error, isLoading } = useQuery({
		operationName: 'courses/slug',
		input: {
			slug: params.courseSlug,
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
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
					<aside className="-mx-4 lg:w-1/5">
						<SidebarNav course={data?.course} />
					</aside>
					<div className="w-full flex-1">
            <DataTable data={tasks} columns={columns} />
          </div>
				</div>
			</>
			) : (
				<Loading />
			)}
		</div>
  )
}

export default withWunderGraph(Course)
