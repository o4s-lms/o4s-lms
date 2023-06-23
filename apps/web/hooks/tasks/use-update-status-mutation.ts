import { useMutation } from '@/lib/wundergraph'

function useUpdateStatusMutation() {

	const updateStatus = useMutation({
		operationName: 'tasks/update-status'
	})

	const trigger: typeof updateStatus.trigger = async (input, options) => {

		return await updateStatus.trigger(input, options)

	}

	return {
		...updateStatus,
		trigger,
	}
}

export default useUpdateStatusMutation
