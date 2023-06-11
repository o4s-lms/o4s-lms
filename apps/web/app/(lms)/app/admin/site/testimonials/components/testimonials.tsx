"use client"

import { useQuery, withWunderGraph } from "@/lib/wundergraph"
import { DataTable } from "../../components/data-table"
import { columns } from "./columns"
import { Loading } from "@/components/loading"

function Testimonials() {
	const { data, error, isLoading } = useQuery({
		operationName: "site/get-testimonials",
		input: {
			locale: "pt",
		},
		enabled: true
	})

	const testimonials = data?.testimonials
	return (
		<>
		{!isLoading ? (
			<DataTable columns={columns} data={testimonials} />
		) : (
			<Loading />
		)}
		</>
	)
}

export default withWunderGraph(Testimonials)