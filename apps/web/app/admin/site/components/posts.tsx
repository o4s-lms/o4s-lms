"use client"

import { useQuery, withWunderGraph } from "@/lib/wundergraph"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { Loading } from "@/components/loading"

function Posts() {
	const { data, error, isLoading } = useQuery({
		operationName: "blog/posts-all",
		enabled: true
	})

	const posts = data?.posts
	return (
		<>
		{!isLoading ? (
			<DataTable columns={columns} data={posts} />
		) : (
			<Loading />
		)}
		</>
	)
}

export default withWunderGraph(Posts)