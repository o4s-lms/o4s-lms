import { client } from "@/lib/wundergraph"

export async function getTasks() {

	const { data, error } = await client.query({
		operationName: 'tasks/all'
	})

  return data?.tasks

}
