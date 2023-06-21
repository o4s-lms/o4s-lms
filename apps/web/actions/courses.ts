import { client } from "@/lib/wundergraph"

export async function currentProgress(courseId: string) {

	const { data, error } = await client.query({
		operationName: 'members/progress',
		input: {
			course_id: courseId
		}
	})

  return data?.progress

}
