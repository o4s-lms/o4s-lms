import { useMutation } from "@/lib/wundergraph"

function useCreateOrderMutation() {

	const createOrder = useMutation({ operationName: 'orders/create' })

	const trigger: typeof createOrder.trigger = async (input, options) => {

		return createOrder.trigger(input, options)

	}

	return {
		...createOrder,
		trigger,
	}
}

export default useCreateOrderMutation
