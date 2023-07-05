"use client"

import Link from "next/link"
import { useQuery, withWunderGraph } from "@/lib/wundergraph"

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import { Loading } from "@/components/loading"

import { useToast } from "@/hooks/use-toast"
import { columns } from "./components/tasks/columns"
import { DataTable } from "./components/tasks/data-table"
import { Separator } from "@/components/ui/separator"

function Tasks() {
	const { toast } = useToast()

	const { data, error, isLoading } = useQuery({
		operationName: 'tasks/all',
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
          <h2 className="text-2xl font-bold tracking-tight">Tarefas</h2>
          <p className="text-muted-foreground">
            Crie as suas tarefas para auxiliar o seu percurso de aprendizagem.
          </p>
        </div>
        <Separator className="my-6" />
				<div className="pb-8 pt-6 md:py-10">
					{!isLoading ? (
						<>
              <DataTable data={data?.tasks} columns={columns} />
						</>
					) : (
						<Loading />
					)}
				</div>
		</div>
		</>
  )
}

export default withWunderGraph(Tasks)
