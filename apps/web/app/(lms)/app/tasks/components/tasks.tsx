"use client"

import * as React from "react"
import { useQuery, withWunderGraph } from "@/lib/wundergraph"

import { Loading } from "@/components/loading"
import { useToast } from "@/hooks/use-toast"
import { columns } from "./tasks/columns"
import { DataTable } from "./tasks/data-table"
import { taskSchema } from "./tasks/data/schema"
import { TasksAllResponseData } from "@o4s/generated-wundergraph/models"

type Tasks = TasksAllResponseData["tasks"]

interface Props {
  tasks: Tasks | undefined
}

function Tasks({ tasks }: Props ) {
	const { toast } = useToast()

  const { data, error, isLoading } = useQuery({
		operationName: 'tasks/course',
		input: {
			course_id: courseId,
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
		{!isLoading ? (
      <DataTable data={tasks} columns={columns} />
		) : (
			<Loading />
		)}
    </>
  )
}

export default withWunderGraph(Tasks)
