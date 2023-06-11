"use client"

import { useQuery, withWunderGraph } from "@/lib/wundergraph"
import { DataTable } from "../../components/data-table"
import { columns } from "./columns"
import { Loading } from "@/components/loading"

function Faqs() {
	const { data, error, isLoading } = useQuery({
		operationName: "site/get-faqs",
		input: {
			locale: "pt",
		},
		enabled: true
	})

	const faqs = data?.faqs
	return (
		<>
		{!isLoading ? (
			<DataTable columns={columns} data={faqs} />
		) : (
			<Loading />
		)}
		</>
	)
}

export default withWunderGraph(Faqs)