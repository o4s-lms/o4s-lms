"use client"

import { useQuery, withWunderGraph } from "@/lib/wundergraph"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { Loading } from "@/components/loading"

function Tags() {
	const { data, error, isLoading } = useQuery({
		operationName: "blog/tags-all",
		enabled: true
	})

	const tags = data?.tags
	return (
		<>
		{!isLoading ? (
			<DataTable columns={columns} data={tags} />
		) : (
			<Loading />
		)}
		</>
	)
}

export default withWunderGraph(Tags)