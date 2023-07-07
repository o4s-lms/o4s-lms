"use client"

import Link from "next/link"
import { useQuery, withWunderGraph } from "@/lib/wundergraph"

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import { Loading } from "@/components/loading"

import { useToast } from "@/hooks/use-toast"
import { DataTable } from "@/components/data-table"
import { columns } from "./components/columns"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

function Courses() {
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
		<div className="container grid items-center space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Cursos</h2>
          <p className="text-muted-foreground">
            Faça a gestão dos seus cursos.
          </p>
        </div>
        <Separator className="my-6" />
				<div className="pb-8 pt-6 md:py-10">
					{!isLoading ? (
						<>
						{data?.courses?.length > 0 ? (
							<div className="pb-4 pt-3 md:py-5">
								<DataTable columns={columns} data={data?.courses} />
							</div>
						) : (
							<Alert className="bg-red-400 font-semibold">
								<AlertTitle>You do not have any course. 🪄</AlertTitle>
								<AlertDescription>
									<Button variant="link">
										<Link href="/cursos">Check your available courses.</Link>
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
