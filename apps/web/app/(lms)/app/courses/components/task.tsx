"use client"

import * as React from "react"
import { useQuery, withWunderGraph } from "@/lib/wundergraph"

import { Loading } from "@/components/loading"
import { useToast } from "@/hooks/use-toast"
import { columns } from "./tasks/columns"
import { DataTable } from "./tasks/data-table"
import { statuses } from "./tasks/data/data"
import useUpdateStatusMutation from "@/hooks/tasks/use-update-status-mutation"

interface Props {
  lessonId: string | undefined
}

function Task({ lessonId }: Props ) {
	const { toast } = useToast()
  const updateStatus = useUpdateStatusMutation()

  const { data, error, isLoading } = useQuery({
		operationName: 'tasks/object',
		input: {
			object_id: lessonId,
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

  const selectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const status: string = event.target.value
    const task = await updateStatus.trigger({
      id: data?.task?.id as string,
      status: status,
    })
    if (task) {
      toast({
        title: "Tarefa atualizada",
        description: "A tarefa foi atualizada com sucesso",
      })
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
      })
    }
  }

  return (
    <>
		{!isLoading ? (
      <div className="relative inline-flex self-center">
        <svg className="pointer-events-none absolute right-0 top-0 m-2 rounded bg-purple-700 p-2 text-white" xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 38 22" version="1.1">
          <title>F09B337F-81F6-41AC-8924-EC55BA135736</title>
          <g id="ZahnhelferDE—Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="ZahnhelferDE–Icon&amp;Asset-Download" transform="translate(-539.000000, -199.000000)" fill="#ffffff" fill-rule="nonzero">
              <g id="Icon-/-ArrowRight-Copy-2" transform="translate(538.000000, 183.521208)">
                <polygon id="Path-Copy" transform="translate(20.000000, 18.384776) rotate(135.000000) translate(-20.000000, -18.384776) " points="33 5.38477631 33 31.3847763 29 31.3847763 28.999 9.38379168 7 9.38477631 7 5.38477631"/>
              </g>
            </g>
          </g>
        </svg>
        <select
          onChange={selectChange}
          value={data?.task?.status}
          className="h-14 w-60 appearance-none rounded border-2 border-purple-700 bg-white pl-5 pr-10 text-2xl font-bold text-gray-600 hover:border-gray-400 focus:outline-none">
            {statuses.map((status) => (
              <option value={status.value}>{status.label}</option>
            ))}
        </select>
      </div>
		) : (
			<Loading />
		)}
    </>
  )
}

export default withWunderGraph(Task)
