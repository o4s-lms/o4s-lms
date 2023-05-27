import { useMutation } from "@/lib/wundergraph"

function useLastActivityMutation() {

	const updateLastActivity = useMutation({
		operationName: 'members/last-activity'
	})

	const trigger: typeof updateLastActivity.trigger = async (input, options) => {
		return await updateLastActivity.trigger(input, options)
	}

	return {
		...updateLastActivity,
		trigger,
	}
}

export default useLastActivityMutation;